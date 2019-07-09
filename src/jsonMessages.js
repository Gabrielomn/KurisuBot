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

const msgParaAdmin = {
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
                },{
                    "name": "command",
                    "text": "Editar/Criar comando",
                    "type": "button",
                    "value": "command"
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

const selectCommand = {
    "attachments": [
        {
            "text": "Selecione o comando",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "callback_id": "command_selection",
            "actions": [
                {
                    "name": "command_list",
                    "text": "Selecione um comando...",
                    "type": "select",
                    "options": [
                        
                    ]
                }
            ]
        }
    ]
}

const editCommand = {
	"dialog": {
		"callback_id": "edit_command",
		"title": "Editar Comando.",
		"submit_label": "Send",
		"notify_on_cancel": false,
		"state": "Limo",
		"elements": [
            {
				"type": "text",
				"label": "Atual nome do comando",
                "name": "current_command_name",
                "placeholder" :"",
                "optional" : false
            },
			{
				"type": "text",
				"label": "Nome do comando",
                "name": "command_name",
                "placeholder" :"Novo nome do comando. Deixe em branco se não for alterar.",
                "optional" : true
            },
            {
				"type": "textarea",
				"label": "Retorno do comando",
                "name": "command_return",
                "placeholder" :"Novo retorno do comando. Deixe em branco se não for alterar.",
                "optional" : true
			},{
				"type": "select",
				"label": "O que fazer",
                "name": "edit_delete",
                "options": [{
                    "value" : "edit",
                    "label" : "Editar comando"
                    },
                {
                    "value" : "delete",
                    "label" : "Deletar comando"
                    }
                ]
            }
		]
	}
}

const newCommand = {
	"dialog": {
		"callback_id": "new_command",
		"title": "Criar Comando.",
		"submit_label": "Send",
		"notify_on_cancel": false,
		"state": "Limo",
		"elements": [
			{
				"type": "text",
				"label": "Nome do comando",
                "name": "command_name",
                "placeholder" : 'Nome do comando. Coloque o "!" na frente',
                "optional" : false
            },
            {
				"type": "textarea",
				"label": "Retorno do comando",
                "name": "command_return",
                "placeholder" :"Retorno do comando.",
                "optional" : false
			}
		]
	}
}

module.exports = {
    msgParaAluno,
    dialog,
    showDoubts,
    msgParaAdmin,
    editCommand,
    selectCommand,
    newCommand
}

