import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ChannelsView from "../views/ChannelsView.vue";
import ChannelView from "../views/ChannelView.vue";
import VideosView from "../views/VideosView.vue";
import VideoView from "../views/VideoView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/youtarin/channels",
    name: "channels",
    component: ChannelsView,
  },
  {
    path: "youtarin/channel/:channel_name",
    name: "Channel",
    component: ChannelView,
    props: true, // This allows the route parameter to be passed as a prop
  },
  {
    path: "youtarin/videos",
    name: "videos",
    component: VideosView,
  },
  {
    path: "youtarin/video/:video_id",
    name: "Video",
    component: VideoView,
    props: true, // This allows the route parameter to be passed as a prop
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
