// TODO: trocar SUA_CHAVE_STADIA pela chave real, gerada em
// https://client.stadiamaps.com (plano gratuito, sem cartão de crédito
// — só cadastro). Foi escolhida no lugar do Google Maps justamente por
// isso: cobertura suficiente pra homologação sem exigir faturamento.
//
// "alidade_smooth" é um estilo claro, neutro — troca por
// "alidade_smooth_dark" se quiser um visual escuro combinando com o
// resto da marca (o app já usa #061414 como fundo em várias telas).
export const MAP_STYLE_URL = `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=8c2d9708-5154-4eec-ac47-ceda4739c2ec`;

// Versão escura — substitui o antigo `darkMapStyle.ts` (era um JSON de
// estilo específico do formato do Google Maps, não reaproveitável aqui).
// Usado no recap animado e nas telas de detalhe de território.
export const MAP_STYLE_URL_DARK = `https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json?api_key=8c2d9708-5154-4eec-ac47-ceda4739c2ec`;
