const PARCOURS = [
  {
    id: "pro",
    titre: "Perfectionner ta pratique",
    description: "Des modules courts et concrets pour améliorer un point précis de ton exploitation.",
  },
  {
    id: "etudiant",
    titre: "Compléter ta formation",
    description: "Un socle théorique et pratique aligné avec les référentiels agricoles.",
  },
  {
    id: "debutant",
    titre: "Démarrer en douceur",
    description: "Les bases expliquées simplement, sans jargon.",
  },
  {
    id: "technicien",
    titre: "Approfondir ton expertise",
    description: "Contenus avancés et études de cas pour appuyer ton rôle de conseil.",
  },
];

export default function ParcoursPage() {
  return (
    <main>
      <h1>Choisis ton parcours</h1>
      <div className="grid3">
        {PARCOURS.map((p) => (
          <div key={p.id} className="mcard">
            <h3>{p.titre}</h3>
            <p>{p.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}