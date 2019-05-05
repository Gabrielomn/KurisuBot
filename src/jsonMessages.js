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

const dialog2 = {
	"dialog": {
		"callback_id": "open_doubt_dialog",
		"title": "Nova Dúvida",
		"submit_label": "Send",
		"notify_on_cancel": true,
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
				"label": "Digita a dùvida",
                "name": "doubt_body",
                "placeholder" :"Aqui vai o corpo da dúvida"
			}
		]
	}
}

const dialog = {
	"dialog": {
		"callback_id": "open_doubt_dialog",
		"title": "Nova Dúvida",
		"submit_label": "Send",
		"notify_on_cancel": true,
		"state": "Limo",
		"elements": [{
				"type": "select",
				"label": "Categoria da dúvida",
                "name": "doubt_category",
                "options": [
                    {"value":"OO",
                     "label" : "Orientação a Objeto"},
                    {"value":"testes", "label": "tests"}
                ]
			},
			{
				"type": "textarea",
				"label": "Digita a dùvida",
                "name": "doubt_body",
                "placeholder" :"Aqui vai o corpo da dúvida"
			}
		]
	}
}
module.exports = {
    msgParaAluno,
    dialog: dialog2
}

