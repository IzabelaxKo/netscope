from config import app, db
from backend.api.enpoints.users_endpoints import *
from enpoints.admin_endpoints import *
from enpoints.assets_endpoints import *

if __name__ == '__main__':
	with app.app_context():
		db.create_all() 
	app.run(debug=True)
