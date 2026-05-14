package com.saisadwiik.skillbridge_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
//says spring to act as a post office
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config){
        //outbound server-client which got message from react it stores in db and then spring boot pushes that messsage to /queue/user-123 example the queue for 1-1 so the message appears in the chat again on frontend side the react shou;d be subscrbed to that queue to get the message
        //topic for boradcasting ,queue for one to one private messages
        config.enableSimpleBroker("/topic","/queue","/user");
        //inbound client -server react sends to this path starting with /app
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");

    }
    @org.springframework.beans.factory.annotation.Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:5174}")
    private String allowedOrigins;

    //tell react to send request to /ws-skillbridge connection point
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
        registry.addEndpoint("/ws-skillbridge").setAllowedOrigins(allowedOrigins.split(","))
        .withSockJS();// falls back to long polling
    }

}
