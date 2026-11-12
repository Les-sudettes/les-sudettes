import { Router} from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

export const eventsRouter = Router();

const CATEGORIES = ["SPORT", "FOOD", "SOLIDAIRE", "VOYAGE"] as const;
const STATUSES = ["DRAFT", "UPCOMING", "OPEN", "CLOSED"] as const;
const HOLD_MINUTES = 15;

async function remainingPlaces(id_event: number, nbr_places: number) {
const holdLimit = new Date(Date.now() - HOLD_MINUTES * 60_000);
const taken = await prisma.reservation.aggregate({
    _sum: { quantity: true },
    where: {
      id_event,
      OR: [{ status: "PAID"}, { status: "PENDING", created_at: { gt: holdLimit } }],
    },
  });
  return nbr_places - (taken._sum.quantity ?? 0);
}

eventsRouter.get("/", async (req, res) => {
    const category = z.enum(CATEGORIES).optional().safeParse(req.query.category);
    if (!category.success) return res.status(400).json({ error: "Catégorie invalide" });

    const events = await prisma.event.findMany({
        where : { 
            status: { in: ["OPEN", "UPCOMING"] },
            ...(category.data && { category: category.data}),
        },
        orderBy: { start_at: "asc" },
    });
    res.json(events);
});

eventsRouter.get("/:slug", async (req, res) => {
    const event = await prisma.event.findUnique({ where: { slug: req.params.slug}});
    if (!event || event.status === "DRAFT") {
        return res.status(404).json({ error: "Événement introuvable"});
    }
    res.json({ ...event, remaining: await remainingPlaces(event.id_event, event.nbr_place)});
});


// Routes Admin

// Vérification des données envoyées pour créer ou modifier un événement
const eventSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, "minuscules, chiffres et tirets uniquement"),
  start_at: z.coerce.date(),
  end_at: z.coerce.date().optional(),
  price: z.number().int().min(0), 
  image: z.url().optional(),
  status: z.enum(STATUSES).default("DRAFT"),
  category: z.enum(CATEGORIES),
  description: z.string().min(1),
  lieu: z.string().min(1),
  nbr_place: z.number().int().min(1),
  level: z.string().optional(),
});


// Conversion du :id de l'url en nbr
function parseId(raw: string) {
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// API Admin pour réupérer tous les événements, brouillon y compris 
eventsRouter.get("/admin/all", async (_req, res) => {
    res.json(await prisma.event.findMany({ orderBy: { start_at: "desc" }}));
});

eventsRouter.post("/", async (req, res) => {
    const parsed = eventSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: z.flattenError(parsed.error) });

    const exists = await prisma.event.findUnique({ where: { slug: parsed.data.slug }});
    if (exists) return res.status(409).json({ error: "Un événement avec ce slug existe déjà" });

    const event = await prisma.event.create({ data: parsed.data});
    res.status(201).json(event);
});

//  Modification d'un événement 
eventsRouter.put("/:id", async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "ID invalide" });

    const parsed = eventSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: z.flattenError(parsed.error) });

    const exists = await prisma.event.findUnique({ where: { id_event: id }});
    if (!exists) return res.status(404).json({ error: "Événement introuvable" });

    const event = await prisma.event.update({ where: { id_event: id }, data: parsed.data });
    res.json(event);
});

// Suppression d'un événement 
eventsRouter.delete("/:id", async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "ID invalide" });

    const exists = await prisma.event.delete({ 
        where: { id_event: id },
        include: { _count: { select: { reservations: true }}},    
    });
    if (!exists) return res.status(404).json({ error: "Événement introuvable" });
   
    // On ne peux pas supprimer un événement qui contient des réservations
    if (exists._count.reservations > 0) {
    return res.status(409).json({ error: "Cet événement a des réservations, passez-le en CLOSED" });
  }

  await prisma.event.delete({ where: { id_event: id }});
  res.status(204).end();
});