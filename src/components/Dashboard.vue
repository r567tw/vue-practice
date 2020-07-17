<template>
  <div class="container-fluid">
    <Navbar></Navbar>
    <div class="row">
      <Sidebar></Sidebar>
      <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
        <Alert></Alert>
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Alert from "./Alert";

export default {
  components: { Sidebar, Navbar, Alert },
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  methods: {
    signout() {
      const api = `${process.env.APIPATH}/logout`;
      const vm = this;
      console.log(process.env.APIPATH, process.env.CUSTOMPATH);
      this.$http.post(api).then(response => {
        if (response.data.success) {
          vm.$router.push("/login");
        }
      });
    }
  }
};
</script>

