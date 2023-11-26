import cv2
import torch
import keyboard
import json
import requests
import schedule
import time


# 로컬 디렉토리에 있는 pt 파일 경로
pt_path = "C:/Users/82105/Desktop/python/best.pt"
# 모델 로드
model = torch.hub.load('ultralytics/yolov5', 'custom', pt_path)
# ESP32-CAM 스트리밍 영상 읽기
stream_url = 'http://192.168.233.250:81/stream'  # ESP32-CAM의 스트리밍 URL로 변경
#cap = cv2.VideoCapture(stream_url)
cap = cv2.VideoCapture(0)# 0 : 내부 카메라, 


def sendCount(people):
    # 데이터
    vehicleno = "7366"
    congestion = people
    url = f"http://172.29.156.64:8080/update/congestion/{vehicleno}/{congestion}"

    # 데이터를 전송할 JSON 형식의 payload
    data = {
        'vehicleno': vehicleno,
        'congestion': congestion
    }

    # PUT 요청 보내기
    response = requests.put(url, data=json.dumps(data), headers={'Content-Type': 'application/json'})

    # 응답 확인
    if response.status_code == 200:
        print("성공적으로 요청을 보냈습니다.")
    else:
        print(f"오류 발생: {response.status_code}, {response.text}")
    

def capturePeople():
    frame = None
    people_max = 0;
    for i in range(5):
        if cap.isOpened():
            ret, img = cap.read()
            if not ret:
                print("실패")
                break
            results = model(img)
            people = len(results.xyxy[0])
            if people_max < people:
                people_max = people

                boxes = results.xyxy[0].numpy()
            
                for box in boxes:
                    start_point = tuple(box[0:2].astype(int))
                    end_point = tuple(box[2:4].astype(int))
                    color = (0, 255, 0)  # 녹색 박스
                    thickness = 2
                    img = cv2.rectangle(img, start_point, end_point, color, thickness)
                    frame = img

    sendCount(people)
    print(people_max)
    cv2.imshow('YOLOv5 Real-time Detection', frame)
    cv2.waitKey(1)

schedule.every(5).seconds.do(capturePeople)

while True:
    schedule.run_pending()
    
    if keyboard.is_pressed("q"):
        print("나가기")
        break

cap.release()
cv2.destroyAllWindows()   
