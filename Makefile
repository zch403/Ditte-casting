run:
	npx concurrently --kill-others-on-fail --handle-input \
		"cd form_app && dotnet run" \
		"cd form-filler-client && ng serve"