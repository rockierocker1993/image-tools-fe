import { Client, type StompSubscription } from '@stomp/stompjs';
import type { WebSocketJobEvent } from '@/types/job.types';
import { subscribeToJob } from '@/lib/socket';

type JobEventCallback = (event: WebSocketJobEvent) => void;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080/ws';

let stompClient: Client | null = null;

const getStompClient = (token?: string): Client => {
  if (!stompClient) {
    stompClient = new Client({
      webSocketFactory: () => new WebSocket(`${WS_URL}/websocket`),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
    });
  }
  return stompClient;
};

const subscribeWhenConnected = (
  client: Client,
  destination: string,
  callback: (body: string) => void
): (() => void) => {
  let subscription: StompSubscription | null = null;

  const doSubscribe = () => {
    subscription = client.subscribe(destination, (message) => {
      callback(message.body);
    });
  };

  if (client.connected) {
    doSubscribe();
  } else {
    const prevOnConnect = client.onConnect;
    client.onConnect = (frame) => {
      prevOnConnect?.call(client, frame);
      doSubscribe();
    };
  }

  return () => subscription?.unsubscribe();
};

export const socketService = {
  connect: (token?: string) => {
    const client = getStompClient(token);
    if (!client.active) {
      client.activate();
    }
  },

  disconnect: () => {
    stompClient?.deactivate();
    stompClient = null;
  },

  onConnectionChange: (
    onConnected: () => void,
    onDisconnected: () => void,
    onError: () => void
  ): (() => void) => {
    const client = getStompClient();
    const prevOnConnect = client.onConnect;
    const prevOnDisconnect = client.onDisconnect;
    const prevOnStompError = client.onStompError;

    client.onConnect = (frame) => {
      prevOnConnect?.call(client, frame);
      onConnected();
    };
    client.onDisconnect = (frame) => {
      prevOnDisconnect?.call(client, frame);
      onDisconnected();
    };
    client.onStompError = (frame) => {
      prevOnStompError?.call(client, frame);
      onError();
    };

    return () => {
      client.onConnect = prevOnConnect;
      client.onDisconnect = prevOnDisconnect;
      client.onStompError = prevOnStompError;
    };
  },

  subscribeToJob: (userId: string,callback: JobEventCallback): (() => void) => {
    const client = getStompClient();
    console.log('Subscribing to job events for user:', userId);
    const unsubResult = subscribeWhenConnected(client, `/topic/job/${userId}`, (body) => {
      console.log('Received job event:', body);
      callback(JSON.parse(body) as WebSocketJobEvent);
    });
    const unsubError = subscribeWhenConnected(client, `/topic/job-error/${userId}`, (body) => {
      console.log('Received job error event:', body);
      callback(JSON.parse(body) as WebSocketJobEvent);
    });

    return () => {
      unsubResult();
      unsubError();
    };
  }
};
