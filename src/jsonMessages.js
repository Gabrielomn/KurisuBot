const msgParaAluno = {
    "text": "O que voce gostaria de fazer?",
    "attachments": [
        {
            "text": "Escolha uma das opcoes",
            "fallback": "You are unable to choose a game",
            "callback_id": "aluno_choice",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "open_doubt",
                    "text": "Abrir uma nova duvida",
                    "type": "button",
                    "value": "open_doubt"
                },
                {
                    "name": "edit_doubt",
                    "text": "Editar duvida",
                    "type": "button",
                    "value": "edit_doubt"
                }
            ]
        }
    ]
}

const dialog = {
	"dialog": {
		"callback_id": "open_doubt_dialog",
		"title": "Nova Dúvida",
		"submit_label": "Send",
		"notify_on_cancel": false,
		"state": "Limo",
		"elements": [{
				"type": "select",
				"label": "Categoria da dúvida",
                "name": "doubt_category",
                "options": [
                ]
			},
			{
				"type": "textarea",
				"label": "Digita a dúvida",
                "name": "doubt_body",
                "placeholder" :"Aqui vai o corpo da dúvida"
			}
		]
	}
}


const showDoubts = {
	"dialog": {
		"callback_id": "edit_doubt",
		"title": "Editar dúvida",
		"submit_label": "Send",
		"notify_on_cancel": false,
		"state": "Limo",
		"elements": [{
				"type": "select",
				"label": "Selecione a dúvida",
                "name": "doubt_select",
                "options": [
                ]
			},
			{
				"type": "textarea",
				"label": "Digita a dúvida",
                "name": "doubt_body",
                "placeholder" :"Se tiver alguma outra pergunta sobre a mesma dúvida escreva aqui, se for fechar a fúvida e quiser agradecer a quem lhe respondeu pode mandar..",
                "optional":true
			},{
				"type": "select",
				"label": "O que fazer",
                "name": "close_open",
                "options": [{
                    "value" : "open",
                    "label" : "Deixar dúvida aberta"
                    },
                {
                    "value" : "close",
                    "label" : "Fechar dúvida"
                    }
                ]
            }
            
		]
	}
}

module.exports = {
    msgParaAluno,
    dialog,
    showDoubts
}

