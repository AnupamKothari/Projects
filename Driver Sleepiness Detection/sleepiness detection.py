from scipy.spatial import distance
from imutils import face_utils
from pygame import mixer
import imutils
import dlib
import cv2


mixer.init()
mixer.music.load("alert.wav")

def eye_aspect_ratio(eye):
	d1 = distance.euclidean(eye[1], eye[5])
	d2 = distance.euclidean(eye[2], eye[4])
	d3 = distance.euclidean(eye[0], eye[3])
	ear = (d1 + d2) / (2.0 * d3)
	return ear
	
thresh = 0.25
image_check = 20
detect = dlib.get_frontal_face_detector()
predict = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

(lStart, lEnd) = face_utils.FACIAL_LANDMARKS_68_IDXS["left_eye"]
(rStart, rEnd) = face_utils.FACIAL_LANDMARKS_68_IDXS["right_eye"]
cap=cv2.VideoCapture(0)
flag=0
while True:
	ret, image=cap.read()
	image = imutils.resize(image, width=450)
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	subjects = detect(gray, 0)
	for subject in subjects:
		landmarks = predict(gray, subject)
		landmarks= face_utils.shape_to_np(landmarks)
		leftEye = landmarks[lStart:lEnd]
		rightEye = landmarks[rStart:rEnd]
		leftEAR = eye_aspect_ratio(leftEye)
		rightEAR = eye_aspect_ratio(rightEye)
		ear = (leftEAR + rightEAR) / 2.0
		if ear < thresh:
			flag += 1
			print (flag)
			if flag >= image_check:
				cv2.putText(image, "***********Sleeping ALERT!************", (10, 30),
					cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
				cv2.putText(image, "***********Sleeping ALERT!************", (10,325),
					cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
				mixer.music.play()
		else:
			flag = 0
	cv2.imshow("image", image)
	key = cv2.waitKey(1) & 0xFF
	if key == ord("e"):
		break
cv2.destroyAllWindows()
cap.release()
