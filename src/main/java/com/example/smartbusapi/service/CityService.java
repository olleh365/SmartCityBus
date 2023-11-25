package com.example.smartbusapi.service;

import com.example.smartbusapi.model.City;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class CityService {

    public String createCity(City city) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("City")
                .document(city.getCityname()).set(city);
        return collectionsApiFuture.get().getUpdateTime().toString();
    }

    public City getCity(String cityname) throws ExecutionException, InterruptedException {
        System.out.println("받은 cityname : " + cityname);
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("City").document(cityname);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        City city;
        if(document.exists()){
            city = document.toObject(City.class);
            return city;
        }
        return null;
    }

    public String updateCity(City city) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionApiFuture = dbFirestore.collection("City").document(city.getCityname()).set(city);
        return collectionApiFuture.get().getUpdateTime().toString();
    }

    public String deleteCity(String cityname){
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = dbFirestore.collection("City").document(cityname).delete();
        return "삭제 성공 : " + cityname;
    }


}
