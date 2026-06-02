/**
 * Vercel Serverless Function: /api/subscribe
 * Conecta com segurança o formulário do front-end à API do Mailchimp.
 */

module.exports = async (req, res) => {
  // 1. Limitar apenas para requisições do tipo POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      message: `Método ${req.method} não permitido. Use POST.`
    });
  }

  try {
    const { email } = req.body || {};

    // 2. Validação simples de campos obrigatórios vazios
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "O campo de e-mail é obrigatório."
      });
    }

    // 3. Validação do formato do e-mail (Segurança adicional no backend)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Por favor, insira um e-mail válido."
      });
    }

    // 4. Recupera e valida a API Key do Mailchimp nas variáveis de ambiente
    const apiKey = process.env.MAILCHIMP_API_KEY;
    if (!apiKey) {
      console.error("Configuração ausente: MAILCHIMP_API_KEY não foi definida.");
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor: Configurações do Mailchimp não encontradas."
      });
    }

    // 5. Extrai o datacenter (sufixo após o hífen na API Key, ex: us16)
    const apiKeyParts = apiKey.split('-');
    if (apiKeyParts.length !== 2) {
      console.error("Chave inválida: Chave de API do Mailchimp está fora do formato padrão.");
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor: Credencial do Mailchimp inválida."
      });
    }
    const dc = apiKeyParts[1];

    // 6. Define ou descobre o Audience ID (List ID)
    let audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    // Se o Audience ID não for especificado, busca a primeira lista/audiência ativa na conta
    if (!audienceId) {
      console.log("MAILCHIMP_AUDIENCE_ID não definida. Buscando lista ativa via API...");
      const listsResponse = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists`, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + Buffer.from('any_string:' + apiKey).toString('base64'),
          'Content-Type': 'application/json'
        }
      });

      if (!listsResponse.ok) {
        const errorText = await listsResponse.text();
        console.error("Erro ao listar audiências no Mailchimp:", errorText);
        return res.status(500).json({
          success: false,
          message: "Não foi possível sincronizar com o Mailchimp. Verifique suas credenciais."
        });
      }

      const listsData = await listsResponse.json();
      if (!listsData.lists || listsData.lists.length === 0) {
        console.error("Nenhuma lista (Audience) encontrada nesta conta do Mailchimp.");
        return res.status(500).json({
          success: false,
          message: "Nenhuma lista de e-mails encontrada na conta do Mailchimp."
        });
      }

      // Escolhe a primeira lista
      audienceId = listsData.lists[0].id;
      console.log(`Usando lista encontrada automaticamente: ID ${audienceId} (${listsData.lists[0].name})`);
    }

    // 7. Envia os dados para a API do Mailchimp
    const mailchimpUrl = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
    const mailchimpResponse = await fetch(mailchimpUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('any_string:' + apiKey).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed' // Registra diretamente como inscrito
      })
    });

    // 8. Trata a resposta do Mailchimp
    if (mailchimpResponse.ok) {
      return res.status(200).json({
        success: true,
        message: "Inscrição realizada com sucesso! Obrigado por assinar nossa newsletter."
      });
    }

    // Trata erros retornados pelo Mailchimp
    const mailchimpError = await mailchimpResponse.json();
    console.error("Resposta de erro do Mailchimp:", mailchimpError);

    // E-mail já cadastrado
    if (mailchimpError.title === 'Member Exists' || mailchimpError.error_code === 'ERROR_CONTACT_EXISTS') {
      return res.status(400).json({
        success: false,
        message: "Este e-mail já está cadastrado em nossa newsletter!"
      });
    }

    // Formato inválido rejeitado pelo Mailchimp
    if (mailchimpError.title === 'Invalid Resource') {
      return res.status(400).json({
        success: false,
        message: "O endereço de e-mail fornecido foi rejeitado como inválido."
      });
    }

    // Outros erros da API do Mailchimp
    return res.status(400).json({
      success: false,
      message: mailchimpError.detail || "Ocorreu um erro ao processar sua inscrição."
    });

  } catch (error) {
    console.error("Exceção na rota /api/subscribe:", error);
    return res.status(500).json({
      success: false,
      message: "Não foi possível conectar ao serviço de newsletter. Tente novamente mais tarde."
    });
  }
};
