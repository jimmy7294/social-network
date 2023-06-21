package apiGO

type notification struct {
	Id      int    `json:"id"`
	Content string `json:"content"`
	Sender  string `json:"sender"`
	Type    string `json:"type"`
	Context string `json:"context"`
}
