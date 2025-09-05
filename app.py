# our flask app controller
from flask import Flask,render_template,session,redirect,Response,send_file,request,jsonify,render_template_string
# all imppppp funcitons from flask!!(abbove)
import sys,os   # system modules.
import psycopg2 # connecting PostgreSQL (online), 
import smtplib  # msg sending service from google/
import random   # to generate otps ad random stuff like uuid..etc
from email.message import EmailMessage  # to strup the email-msg object.
from datetime import date,datetime


now = datetime.now() # holds the complete timestamps with YR-MO-DAY HR-MIN-SEC-ms format.
print(now)
# importing socketio packages in python.
from flask_socketio import SocketIO, join_room, leave_room, send, emit


from werkzeug.security import generate_password_hash, check_password_hash # password hashing library to encrypt passwords.



gmail_master = "jinchuriki0512@gmail.com"  # this is the mail-id im sending all the mails from to anyone aka master-id
app_pass = "epwxgcsjovtqsgmf"  # this is the google password that i'm using setup exclusively for my app.


# SQL-py conection object
conn = psycopg2.connect("postgresql://neondb_owner:npg_4ZMlv5hIYknA@ep-weathered-queen-af0a8a5l-pooler.c-2.us-west-2.aws.neon.tech/users?sslmode=require&channel_binding=require") # connection URL
cur = conn.cursor()  # creating a cursor object to exceute queries 


app = Flask(__name__) # initialising the flask app.
socketio = SocketIO(app)

app.secret_key = "AKATSUKIWATSIDHOTHA" # my secret key used for locking session cookies.


# setting up otp message.
def otp_prepare(to_email,otp):
    msg= EmailMessage()  # preparing the message format.
    msg['subject'] = "your OTP from Akatsuki Applicaiton"
    msg['From'] = gmail_master

    msg['To'] = to_email
    msg.set_content(f"your one tiem password to register is {otp}")
    
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:  # this is a standard code block to send msg via SMTP
        smtp.login(gmail_master, app_pass)  # loggin SMTP with our google accoiunt creds
        smtp.send_message(msg)  # sedning the prepared msg

   

# now, sending the message to the mail.
@app.route("/send_otp",methods = ["POST"])
def send_otp():
    email = request.form.get("e-mail")    # geting the email from the usr's input
    otp = str(random.randint(100000, 999999))  # geenrating a randome number as otp blw th give range

    session['email'] = email   # storing emails in sessions
    session['otp'] = otp       # storing otp temporaily in sessions

    otp_prepare(email,otp)

    return render_template("verify_otp.html")

# now, sending the message to the mail.
@app.route("/send_otp_reset",methods = ["POST"])
def send_otp_reset():
    email = request.form.get("e-mail")    # geting the email from the usr's input
    otp = str(random.randint(100000, 999999))  # geenrating a randome number as otp blw th give range

    session['email'] = email   # storing emails in sessions
    session['otp'] = otp       # storing otp temporaily in sessions

    otp_prepare(email,otp)

    return render_template("forgot_pass/verify_reset.html")

## this is to locate password_box_reset.html for client side navigation.
@app.route('/password_box_reset')
def password_box_reset():
    return render_template('/forgot_pass/password_box_reset.html')

#***************************************************************************************#

# L O G I N  R O U T E S

# checking tp while login..this will redirect user directly to server page.
@app.route("/verify-otp-login",methods=["POST"])  # otp-verification route
def verify_login():
    user_otp = request.json.get("otp_login") # the request boday from JS expects a json formatted request a it's type..so json.get.
    print(user_otp)
    if session['otp'] == user_otp:
          return jsonify({'status': 'success', 'message': 'OTP verified!'}) # response to JS
    else:
        return jsonify({'status': 'fail', 'message': 'Invalid OTP'}) # response to JS

        
@app.route("/signin",methods=['POST'])
def letin():
    if request.method == "POST":
         # now you wanna implement Login part i.r to check the creds of user within db ..if match login, else : redirect the user to the home p[age]
        session['email'] = request.form.get('mail_field')
        session['pass'] = request.form.get('pass_field')
        print(session['email'])
        print(session['pass'])
        # get the contents of DB to check the user entered etails.
        
        cur.execute("SELECT password FROM auth WHERE email = %s", (session['email'],))
        get_data = cur.fetchone()
        if get_data!= None:
                if check_password_hash(get_data[0],session['pass']):
                    otp = str(random.randint(100000, 999999))  # geenrating a randome number as otp blw th give range
                    session['otp'] = otp       # storing otp temporaily in sessions

                    otp_prepare(session['email'],otp)
                    return render_template("otp_status.html")
                
                else:
                    return redirect("/")
        else:
            return render_template("404.html")
        
   

#*************************************************************************************************#

## REGISTER ROUTES

@app.route("/verify-otp",methods=["POST"])  # otp-verification route
def verify():
    user_otp = request.json.get("otp") # the request boday from JS expects a json formatted request a it's type..so json.get.
    print(user_otp)
    if session['otp'] == user_otp:
          return jsonify({'status': 'success', 'message': 'OTP verified!'}) # response to JS
    else:
        return jsonify({'status': 'fail', 'message': 'Invalid OTP'}) # response to JS


# route to insert new password in to the DB.
@app.route('/insert_pass',methods=['POST'])
def update_pass():
    updat_pass = request.form.get("passwd")
    #now let's hash that.
    updat_pass_hashed = generate_password_hash(str(updat_pass))
    cur.execute('update AUTH set password =%s where email=%s',(updat_pass_hashed,session['email']))
    conn.commit()
    return render_template('forgot_pass/reset_status.html')


@app.route("/send_pass",methods = ["POST"])
def final_auth():

    if request.method == "POST":   # THEN TAKE IT AS FRESH CRREDS (register into DB)
        user_pass = request.form.get("passwd")
        confirm_user_pass = request.form.get("passwd_confirm")

        if (user_pass == confirm_user_pass ):
            session['passwd'] = generate_password_hash(user_pass)

        # updating stuff in the database.

            # creating a unique token.
            token = random.randint(1000,9999)

            # checking all tokens from the table dictionary.
            cur.execute('SELECT token_no FROM auth')
            token_list = [row[0] for row in cur.fetchall()]

            if token not in token_list:
                default_name = "AkatsukiMember"+str(token)
                token_hashed = generate_password_hash(str(token))

                # cerating a lsit of default profile pics..using google drive as the cloud.
                # the img URL format (std) : https://drive.google.com/uc?export=view&id=FILE_ID
                pics_list = [
                    "https://drive.google.com/thumbnail?id=1tgnFexWcqdero1GTVz48ubuTUXqxapJ7&sz=s800",
                    "https://drive.google.com/thumbnail?id=1yFQS9pyzVxTubN-37vyPiI9Zy_HIta2E&sz=s800"
                    "https://drive.google.com/thumbnail?id=13ni2750vFQxUVaNJ-SUz1UFfy9LtfDrJ&sz=s800"
                    "https://drive.google.com/thumbnail?id=1X5UEggI8YN3QqbbxGCfcvUTSCpj6HUkl&sz=s800"
                    "https://drive.google.com/thumbnail?id=1otuRRO0eFEXiG7vX_deAZUgsvwZeM2gE&sz=s800"
                    "https://drive.google.com/thumbnail?id=1pRk20N_2lK44EAX34toRcxumc_eONQ-r&sz=s800"
                    "https://drive.google.com/thumbnail?id=1sPn88evefN5Au21PSH7IpX_yejsY9xvB&sz=s800"
                    "https://drive.google.com/thumbnail?id=1qTSTcc3wmStIiHtVU2E28O-3O5TFU94_&sz=s800"
                    "https://drive.google.com/thumbnail?id=1KMKNBYh8b_TFtGKFn5TnkITuT1WYs9P8&sz=s800"
                  

                ]
             

                
                choice_pic = random.randint(0,len(pics_list)-1)
                default_pic = pics_list[choice_pic]
                today = date.today() 
                cur.execute("INSERT INTO auth(token_no, email, password, name, provider, profile_pic, created_at, token_hashed) values(%s,%s,%s,%s,%s,%s,%s,%s)",(token,session['email'],session['passwd'],default_name,'manual',default_pic,today,token_hashed))
                conn.commit()
                return render_template("server.html")
        
        else:
            print("passwords do not match!")

            return render_template("index.html")
        

#***********************************************************************************#


## O T H E R  R O U T E S.

        

#reset password on login page.
@app.route('/forgot_pass')
def reset_otp():
    return render_template('forgot_pass/reset_pass.html')




# password UI route
@app.route("/passwd_box")
def password_ip():
    return render_template("password_box.html")
       


@app.route("/")  # this is the rout for the home page
def index():
    return render_template("index.html")

@app.route('/login')
def login_redirect():
    return render_template("login.html")

@app.route('/register')
def reg_user():
    return render_template("register.html")

# logout route
@app.route('/logout')
def logout():
    session.clear()  # clearing sessiosn cookies and user data
    return redirect('/')  # redirecting to home page.

@app.route("/serve")
def serve():
    return render_template("server.html")

'''/*******************************************************************************************************************/'''

## SOCKET EVENTS / ROUTES ##

@socketio.on('connect')
def handle_connect():
    print("user connected!")
    emit('user_joined','u are Active ⚡',to=request.sid)
    # getting username, Xp from data from users table.
    cur.execute("select * from auth")
    lead_data = cur.fetchall()
    leader_list = [[i[3],i[-2]] for i in lead_data]
   
    # get token_no of the user logged in from db.
    cur.execute("select * from auth where email =%s",(session["email"],))
    print(session)
    prof_data = list(cur.fetchall()[0])
    token_no = prof_data[0]
    email = prof_data[1]
    name = prof_data[3]
    is_active = prof_data[4]
    pic = prof_data[6]
    xp = prof_data[-2]
    prof_data = [token_no,email,name,is_active,pic,xp]
    print(pic) # to check the pics CDN link.
   
    # now display username and xp into leaderboard from the dict.
    emit("leaderboard",leader_list,broadcast=True)
    emit('user_XP',xp,to=request.sid)
    emit("profile_data",prof_data,to=request.sid)
    emit("session_data",{"token" : token_no,"email":email,'name':name})


@socketio.on('logout')
def logout_user(data):
    if data == True:
        session.clear()
        socketio.emit('logemout',True)


## socket to listen for channels swtiching.


## for channels.
@socketio.on('channel_triggered')
def lifetalks(data):
    if data['status'] == True:
        join_room(room = data['room'])
        print(f'joined room : {data['room']}')

         # loading stuff related to that room from db
        cur.execute('select token_no,user_name,message,time from messages where room = %s',(data['room'],))
        fetch_data = cur.fetchall()
        cur.execute('select distinct token_no from messages where room = %s AND user_mail=%s',(data['room'],session['email'],))
        current_token = cur.fetchall()
        # preparing the time format.
        msgs_fetched = [ [i[0],i[1],i[2],i[3].strftime("%H:%M")] for i in fetch_data]
        print(msgs_fetched)
        emit('got_fetched?',{'msg_list':msgs_fetched,'token_type':current_token})
        

## a socket listenr to insert data into db specific to rooms.
@socketio.on('cha')
def insert_msg(data):
    token = data['token']
    email = data['email']  
    msg_content = data['msg_content']
    name = data['name']
    room = data['room']
    cur.execute('INSERT INTO messages(token_no,user_name,message,room,user_mail) values(%s,%s,%s,%s,%s)',(token,name,msg_content,room,email))
    conn.commit()       # commiting the chages after making changes to db .
    print('message inserted!')
    
### bro, this is yet to be done which is at hte highest priority curretly.

# you need to fetch all te msgs from the db to the socet listerner based on room given by the dtaa request freed from JS.
# and also the JS should handle the message box div's positon efore append it to the div.
# i.e if the msg token_no asscociated = session[token] i.e is th current user's token, then append it to the left.
# for al the other msgs , append it to the right.
# for now I'm pushing thee source code to the git hub. # 17/08 2025 @6 :32 pm.   


@socketio.on('fetch_msgs')
def send_message(data):
    room_name = data['toroom']
    msg_value = data['msg_value']
    time_stp = now.strftime("%H:%M")
    print(time_stp)
    emit('addoff',{'msg_value':msg_value,'time':time_stp,'name':data['name']},to=room_name)

##########################################################################################
    
# Run the app - on condition check.
if __name__ == "__main__":
    #app.run(debug=True)
    socketio.run(app,debug=True)



