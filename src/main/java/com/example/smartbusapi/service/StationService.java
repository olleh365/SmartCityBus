package com.example.smartbusapi.service;

import com.example.smartbusapi.model.Station;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class StationService {

    public String createStation(Station station, String city) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("Station")
                .document(station.getNodenm() + "-" + city).set(station);
        return collectionsApiFuture.get().getUpdateTime().toString();
    }

    public Station getStation(String nodenm) throws ExecutionException, InterruptedException {
        System.out.println("받은 nodenm : " + nodenm);
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("Station").document(nodenm);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        Station station;
        if(document.exists()){
            station = document.toObject(Station.class);
            return station;
        }
        return null;
    }

    public List<Station> getStationList() throws InterruptedException, ExecutionException {
        System.out.println("정류소 정보 출력");
        Firestore dbFirestore = FirestoreClient.getFirestore();
        // 컬렉션의 정보를 받아온다.
        CollectionReference collectionReference = dbFirestore.collection("Station");
        // 컬렉션을 가져올꺼기 때문에 쿼리 사용
        ApiFuture<QuerySnapshot> query = collectionReference.get();
        // 가져온 컬렉션의 모든 문서를 가져온다.
        QuerySnapshot querySnapshot  = query.get();
        // 새로운 List를 만들어서 안에 하나씩 넣고 return해서 출력
        List<Station> allStations = new ArrayList<>();
        for (QueryDocumentSnapshot document : querySnapshot) {
            Station stationInfo = document.toObject(Station.class);
            allStations.add(stationInfo);
        }

        return allStations;
    }

    public String updateStation(Station station) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionApiFuture = dbFirestore.collection("Station").document(station.getNodenm()).set(station);
        return collectionApiFuture.get().getUpdateTime().toString();
    }

    public String deleteStation(String nodenm){
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = dbFirestore.collection("Station").document(nodenm).delete();
        return "삭제 성공 : " + nodenm;
    }
}
