from deepface import DeepFace
from face_recognizer import candidate_verification
from retrive_student_id import find_matric_no,get_image_url
from flask import Flask, request, render_template, flash, redirect, url_for,session, logging, send_file, jsonify, Response, render_template_string
import numpy as np
import sqlite3
import csv
import cv2
import json
import camera
import base64
from face_detector import extract_face


app = Flask(__name__)
app.secret_key = "abc"

conn = sqlite3.connect('database.db')



def user_role_student(f):
	@wraps(f)
	def wrap(*args, **kwargs):
		if 'logged_in' in session:
			if session['user_role']=="student":
				return f(*args, **kwargs)
			else:
				flash('You dont have privilege to access this page!','danger')
				return render_template("404.html") 
		else:
			flash('Unauthorized, Please login!','danger')
			return redirect(url_for('login'))
	return wrap




@app.route('/')
def index():
    return redirect('/login')




@app.route('/login', methods=['GET','POST'])
def login():
    error = None
    if request.method == 'POST':
        id = request.form['username']
        password = request.form['password']

        success,data = confirmPassword(id, password)
        if success:
            print(id, password)
            # flash("Successfuly Logged in")
            return redirect(url_for('verify_id', data=id))
        
        else:
            error = "Incorrect Login details"

    return render_template("login.html", error=error)


     


@app.route('/verify/<data>', methods=['GET','POST'])
def verify_id(data):
    error = None
    if request.method == 'POST':
        print('picture captured')
        imgdata1 = request.form['image_hidden']
        nparr1 = np.frombuffer(base64.b64decode(imgdata1), np.uint8)
        image1 = cv2.imdecode(nparr1, cv2.IMREAD_COLOR)
        url = get_image_url(data)
        # image2 = cv2.imread('static/images/cscDataPics/'+url)
        image2 = cv2.imread('James.jpg')
        # result = candidate_verification(image1, image2)
        
        if True:
           return redirect(url_for('student_dashboard', id = data)) 

        else:
            error = 'Unable to verify Candidate Image'

    # print(data)
    id = data
    return render_template("verification.html", id = id.upper(), error=error)





@app.route('/student/<id>', methods=['GET','POST'])
def student_dashboard(id):
    if request.method == 'POST':
        print('Post')
        img_url = get_image_url(id)
        return redirect(url_for('takeTest', id=id))
        
    return render_template("student_index.html", data=id)




@app.route('/staff', methods=['GET','POST'])
def staff_dashboard():
    return render_template("staff_index.html")

    

@app.route('/take-test/<id>', methods=['GET','POST'])
def takeTest(id):
    img_url = get_image_url(id)
    num = 20
    return render_template("question.html", img_url=img_url, id = id, n = num)



@app.route('/exam-history', methods=['GET','POST'])
def examHistory():
    return render_template("student_index.html")



@app.route('/video_feed', methods=['GET','POST'])
def video_feed():

    if request.method == "POST":

        studentId = request.form['data[studtId]']
        selectedOptions = request.form['data[optionSelect]']
        imgData = request.form['data[imgData]']
        proctorData = camera.get_frame(imgData)        
        head_movement = proctorData['head_movement']
        warning = proctorData['warning']
        cheating = proctorData['cheating']
        print(proctorData)
        return proctorData


# def end_examination(student_data):





def confirmPassword(id, password):
    id = id.lower()
    if id.startswith("sci"):
        user_type = 'student'
        return find_matric_no(id, password)
    else:
        user_type = 'lecturer'
        print('lecturer')
 


@app.route('/question/<number>', methods=['GET'])
def read(number):
    question_num = {}
    num = int(number) - 1
    docs = open('questions.json')
    data = json.load(docs)
    all_questions = data['questions'] 

    for i in range(len(all_questions)):
        if num == i:

            question_num["question"] = all_questions[i]["question"]
            question_num['A'] = all_questions[i]["A"] 
            question_num['B'] = all_questions[i]["B"] 
            question_num['C'] = all_questions[i]["C"] 
            question_num['D'] = all_questions[i]["D"] 
            question_num['num'] = i + 1
    
    return question_num
        
    

# def generate_frame():
#     camera = cv2.VideoCapture(0)
#     while True:
#         success, frame = camera.read()

#         if success:
#             faces = find_faces(frame, )

if __name__ == "__main__":
	app.run(host = "0.0.0.0",debug=True)