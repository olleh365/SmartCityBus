import cv2
from urllib.request import urlopen
import numpy as np
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
#model = torch.hub.load('ultralytics/yolov5', 'yolov5s')
# ESP32-CAM 스트리밍 영상 읽기
url = 'http://192.168.233.250/cam-hi.jpg'  # ESP32-CAM의 스트리밍 URL로 변경 


def sendCount(people):
    # 데이터
    vehicleno = "7306"
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
    frame = None # 이거 실행되는지 확인 -> 안되면 global로 처리하는 것으로 가능.
    people_max = 0;
    for i in range(5):
        img_resp = urlopen(url)
        img_arr = np.array(bytearray(img_resp.read()), dtype=np.uint8)
        img = cv2.imdecode(img_arr, -1)
        
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
                img= cv2.rectangle(img, start_point, end_point, color, thickness)
                frame = img
        
    sendCount(people_max) # 모델이 이상한가 화질이 떨어지는 esp32cam에서 사람을 읽어오는데 부정확성이 발생. 이를 해결하기 위해 5번 반복하여 최댓값을 전송한다.
    print(people_max)
    if frame is not None:
        cv2.imshow('YOLOv5 Real-time Detection', frame)
        cv2.waitKey(1)

schedule.every(5).seconds.do(capturePeople)

while True:
    schedule.run_pending()
    
    if keyboard.is_pressed("q"):
        print("나가기")
        break

cv2.destroyAllWindows()   
