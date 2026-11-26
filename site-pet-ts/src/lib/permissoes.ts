// Regras de permissão. Todo mundo logado VÊ tudo; mudar depende do papel e do grupo.
// Funções puras, sem acesso a banco, para poderem ser usadas em páginas e ações.

export type Papel = "admin" | "editor";
export type Perfil = { papel: Papel; grupo: number | null };

// Alterar ou excluir algo de um grupo: admin em qualquer um; editor só no próprio.
// Itens do canal geral (grupo = null) são só dos administradores.
export function podeGerenciar(usuario: Perfil, grupoDoItem: number | null) {
  if (usuario.papel === "admin") return true;
  return grupoDoItem !== null && usuario.grupo === grupoDoItem;
}

// Publicar: qualquer um no canal geral; no grupo, só admin ou o editor daquele grupo.
export function podePublicarEm(usuario: Perfil, grupo: number | null) {
  return grupo === null || podeGerenciar(usuario, grupo);
}

// Filtro de exclusão no banco: "todos" (admin) ou o número do grupo do editor.
export function escopoDeGestao(usuario: Perfil): "todos" | number {
  if (usuario.papel === "admin") return "todos";
  if (usuario.grupo === null) throw new Error("Você ainda não está vinculado a um grupo. Peça a um administrador.");
  return usuario.grupo;
}
