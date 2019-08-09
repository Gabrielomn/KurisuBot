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
                    "name": "keyword",
                    "text": "Editar/Criar Keyword",
                    "type": "button",
                    "value": "keyword"
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

const selectKeyword = {
    "attachments": [
        {
            "text": "Selecione a Keyword",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "callback_id": "keyword_selection",
            "actions": [
                {
                    "name": "keyword_list",
                    "text": "Selecione uma keyword...",
                    "type": "select",
                    "options": [
                        
                    ]
                }
            ]
        }
    ]
}

const editKeyword = {
	"dialog": {
		"callback_id": "edit_keyword",
		"title": "Editar Keyword.",
		"submit_label": "Update!",
		"notify_on_cancel": false,
		"state": "Limo",
		"elements": [
            {
				"type": "text",
				"label": "Atual nome da keyword",
                "name": "current_keyword_name",
                "placeholder" :"",
                "optional" : false
            },
			{
				"type": "text",
				"label": "Nome da Keyword",
                "name": "keyword_name",
                "placeholder" :"Novo nome da keyword. Deixe em branco se não for alterar.",
                "optional" : true
            },
            {
				"type": "textarea",
				"label": "Info associada a keyword",
                "name": "link",
                "placeholder" :"Nova info da keyword. Deixe em branco se não for alterar.",
                "optional" : true
			},{
				"type": "select",
				"label": "O que fazer",
                "name": "edit_delete",
                "options": [{
                    "value" : "edit",
                    "label" : "Editar keyword"
                    },
                {
                    "value" : "delete",
                    "label" : "Deletar keyword"
                    }
                ]
            }
		]
	}
}

const newKeyword = {
	"dialog": {
		"callback_id": "new_keyword",
		"title": "Criar keyword.",
		"submit_label": "Send",
		"notify_on_cancel": false,
		"state": "Limo",
		"elements": [
			{
				"type": "text",
				"label": "Nome da Keyword",
                "name": "keyword_name",
                "placeholder" : 'Nome da Keyword',
                "optional" : false
            },
            {
				"type": "textarea",
				"label": "Info associada a keyword",
                "name": "link",
                "placeholder" :"Algum material que ajude no topico.",
                "optional" : false
			}
		]
	}
}

const dialogConfig = {
	"dialog": {
		"callback_id": "config_channel",
		"title": "Configuração inicial",
		"submit_label": "Send",
		"notify_on_cancel": false,
		"state": "Limo",
		"elements": [{
				"type": "select",
				"label": "Canal das dúvidas",
                "name": "channelPost",
                "data_source":"conversations"
            },
            {
				"type": "select",
				"label": "Canal dos monitores",
                "name": "channelNotification",
                "data_source":"conversations"
            }
		]
	}
}

const menuConfig = {
    "text": "Configuração do bot",
    "attachments": [
        {
            "text": "Lets go",
            "fallback": "You are unable to choose a game",
            "callback_id": "chose_doubt_channel",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "chose_channel",
                    "text": "Configuração inicial",
                    "type": "button",
                    "value": "chose_channel"
                }
            ]
        }
    ]
}

module.exports = {
    msgParaAluno,
    dialog,
    showDoubts,
    msgParaAdmin,
    selectKeyword,
    editKeyword,
    newKeyword,
    menuConfig,
    dialogConfig
}

