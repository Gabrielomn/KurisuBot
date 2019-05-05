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
	"trigger_id": "13345224609.738474920.8088930838d88f008e0",
	"dialog": {
		"callback_id": "ryde-46e2b0",
		"title": "Request a Ride",
		"submit_label": "Request",
		"notify_on_cancel": true,
		"state": "Limo",
		"elements": [{
				"type": "text",
				"label": "Pickup Location",
				"name": "loc_origin"
			},
			{
				"type": "text",
				"label": "Dropoff Location",
				"name": "loc_destination"
			}
		]
	}
}
module.exports = {
    msgParaAluno,
    dialog
}

