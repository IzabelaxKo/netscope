from flask import Flask, jsonify


app = Flask(__name__)

@app.route("/")
def index():
	return jsonify(message="Welcome to the Netscope API!")


@app.get("/api/health")
def health():
	return jsonify(status="ok", service="netscope-api")


if __name__ == "__main__":
	app.run(host="127.0.0.1", port=5000)
