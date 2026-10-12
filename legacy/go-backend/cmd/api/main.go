
package main

import (
	"log"
	"net/http"

	"github.com/luizbarcelar/devflow-ai/backend/internal/handlers"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/health", handlers.Health)

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set(
			"Access-Control-Allow-Origin",
			"http://localhost:4200",
		)

		mux.ServeHTTP(w, r)
	})

	log.Println("DevFlow AI API running on port 8080")

	log.Fatal(http.ListenAndServe(":8080", handler))
}
