package socket

import (
	"backend/backend/internal/data"
	"backend/backend/internal/helper"
	"time"
)

func SendNotificationToAGroup(sender, receiver int, content, context, notifType string) error {

	senderName, err := helper.GetUsername(sender)
	if err != nil {
		return err
	}

	newMsg := data.UserMessage{
		Receiver: context,
		Sender:   senderName,
		Created:  time.Now(),
		Context:  context,
		Content:  content,
		Type:     notifType,
	}
	FindAndSendToGroup(newMsg)
	return err
}
