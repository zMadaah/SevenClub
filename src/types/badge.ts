// Definição fixa da insígnia — o que ela é, não muda entre temporadas
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconLib: 'ionicons' | 'mci';
}

// Registro de quando um usuário desbloqueou uma insígnia, sempre
// amarrado a uma temporada específica — é esse vínculo que faz a
// conquista "zerar" quando a temporada muda: numa temporada nova,
// simplesmente não existe nenhum BadgeUnlock ainda pra ela
export interface BadgeUnlock {
  badgeId: string;
  seasonId: string;
  unlockedAtLabel: string;
}

// Formato "resolvido" que a UI consome — catálogo + estado de
// desbloqueio já combinados pra temporada atual
export interface BadgeWithStatus extends Badge {
  unlocked: boolean;
  unlockedAtLabel?: string;
}
