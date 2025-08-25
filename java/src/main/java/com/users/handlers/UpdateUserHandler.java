package com.users.handlers;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

public class UpdateUserHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    private static List<Map<String, Object>> users = new ArrayList<>();

    static {
        users.add(Map.of("id", 1, "nombre", "Juan", "email", "juan@mail.com"));
        users.add(Map.of("id", 2, "nombre", "Ana", "email", "ana@mail.com"));
    }

    private ObjectMapper mapper = new ObjectMapper();

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent event, Context context) {
        try {
            int id = Integer.parseInt(event.getPathParameters().get("id"));
            Map<String, Object> body = mapper.readValue(event.getBody(), Map.class);

            for (int i = 0; i < users.size(); i++) {
                if ((int) users.get(i).get("id") == id) {
                    users.set(i, Map.of(
                            "id", id,
                            "nombre", body.get("nombre"),
                            "email", body.get("email")
                    ));
                    return new APIGatewayProxyResponseEvent().withStatusCode(200)
                            .withBody(mapper.writeValueAsString(users.get(i)));
                }
            }
            return new APIGatewayProxyResponseEvent().withStatusCode(404).withBody("User not found");

        } catch (Exception e) {
            return new APIGatewayProxyResponseEvent().withStatusCode(500).withBody(e.getMessage());
        }
    }
}
