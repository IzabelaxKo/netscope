import os
import sys

# Ensure backend/api is in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from config import app, db
from enpoints.users_endpoints import *
from enpoints.admin_endpoints import *
from enpoints.assets_endpoints import *
from enpoints.user_endpoints import *

if __name__ == '__main__':
	with app.app_context():
		db.create_all() 
	app.run(debug=True)
