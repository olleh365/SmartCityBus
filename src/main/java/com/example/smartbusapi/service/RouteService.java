package com.example.smartbusapi.service;

import com.example.smartbusapi.model.Route;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class RouteService {
    public String createRoute(Route route) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("Route")
                .document(route.getRouteid()).set(route);
        return collectionsApiFuture.get().getUpdateTime().toString();
    }

    public Route getRoute(String routeid) throws ExecutionException, InterruptedException {
        System.out.println("받은 routeid : " + routeid);
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("Route").document(routeid);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        Route route;
        if(document.exists()){
            route = document.toObject(Route.class);
            return route;
        }
        return null;
    }

    public List<Route> getRouteList() throws InterruptedException, ExecutionException {
        System.out.println("정류소 정보 출력");
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference collectionReference = dbFirestore.collection("Route");
        ApiFuture<QuerySnapshot> query = collectionReference.get();
        QuerySnapshot querySnapshot  = query.get();
        List<Route> allRoutes = new ArrayList<>();
        for (QueryDocumentSnapshot document : querySnapshot) {
            Route RouteInfo = document.toObject(Route.class);
            allRoutes.add(RouteInfo);
        }
        return allRoutes;
    }

    public String updateRoute(Route route) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionApiFuture = dbFirestore.collection("Route").document(route.getRouteid()).set(route);
        return collectionApiFuture.get().getUpdateTime().toString();
    }

    public String deleteRoute(String routeid){
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = dbFirestore.collection("Route").document(routeid).delete();
        return "삭제 성공 : " + routeid;
    }
}
