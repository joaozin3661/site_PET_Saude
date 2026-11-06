import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { usuarioAtual } from "@/lib/auth";

const TIPOS_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

// Só usuários logados geram permissão de upload. O arquivo vai direto ao Blob,
// sem passar pela função do Vercel (que tem limite de 4,5 MB por requisição).
export async function POST(request: Request) {
  const corpo = (await request.json()) as HandleUploadBody;
  try {
    const resposta = await handleUpload({
      body: corpo,
      request,
      onBeforeGenerateToken: async () => {
        const usuario = await usuarioAtual();
        if (!usuario) throw new Error("Faça login para enviar arquivos.");
        return {
          allowedContentTypes: TIPOS_PERMITIDOS,
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return Response.json(resposta);
  } catch (erro) {
    return Response.json({ erro: (erro as Error).message }, { status: 400 });
  }
}
