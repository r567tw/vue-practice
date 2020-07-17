
<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>客戶名稱</th>
          <th>客戶電話</th>
          <th>客戶Email</th>
          <th>留言</th>
          <th>是否付款</th>
          <th>付款日期</th>
          <th>總額</th>
          <th>訂單細節</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in orders" :key="item.id">
          <td>{{ item.user.name }}</td>
          <td>{{ item.user.tel }}</td>
          <td>{{ item.user.email }}</td>
          <td>{{ item.message }}</td>
          <td>
            <span v-if="item.is_paid" class="text-success">已付款</span>
            <span v-else class="text-danger">未付款</span>
          </td>
          <td>{{ item.paid_date | moment("MM/DD/YY hh:mm:ss") }}</td>
          <td>{{ item.total | currency }}</td>
          <td>
            <router-link
              :to="{ name: 'CustomerCheckout', params: { orderId: item.id }}"
              class="nav-link"
              target="_blank"
            >訂單細節</router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled': !pagination.has_pre }">
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            @click.prevent="getOrders(pagination.current_page - 1)"
          >
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li
          class="page-item"
          v-for="page in pagination.total_pages"
          :key="page"
          :class="{'active': pagination.current_page === page}"
        >
          <a class="page-link" href="#" @click.prevent="getOrders(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{'disabled': !pagination.has_next }">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click.prevent="getOrders(pagination.current_page + 1)"
          >
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "OrderList",
  data() {
    return {
      orders: [],
      order: {},
      isLoading: false,
      pagination: {}
    };
  },
  methods: {
    getOrders(page = 1) {
      this.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`;
      const vm = this;
      this.$http.get(api).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          vm.isLoading = false;
          vm.orders = response.data.orders;
          vm.pagination = response.data.pagination;
        } else {
          this.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    },
    openDetail(item) {
      this.order = Object.assign({}, item);
      $("#orderModal").modal("show");
    }
  },
  created() {
    this.getOrders();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.nav-link {
  padding: 0px;
}
</style>
