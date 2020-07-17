
<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openModal(true,{})">建立新的優惠卷</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>序號</th>
          <th>有效期限</th>
          <th>是否啟用</th>
          <th>折抵</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in coupons" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.code }}</td>
          <td>{{ item.due_date | moment("MM/DD/YY hh:mm:ss") }}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>{{ item.percent }}%</td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click="openDelCouponModal(item)">刪除</button>
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
            @click.prevent="getCoupons(pagination.current_page - 1)"
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
          <a class="page-link" href="#" @click.prevent="getCoupons(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{'disabled': !pagination.has_next }">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click.prevent="getCoupons(pagination.current_page + 1)"
          >
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
    <!-- Modal -->
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增優惠卷</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="請輸入標題"
                    v-model="coupon.title"
                  />
                </div>

                <div class="form-group">
                  <label for="code">序號</label>
                  <input
                    type="text"
                    class="form-control"
                    id="code"
                    placeholder="請輸入序號"
                    v-model="coupon.code"
                  />
                </div>

                <div class="form-group">
                  <label for="percent">折抵</label>
                  <input
                    type="number"
                    class="form-control"
                    id="percent"
                    placeholder="請輸入折抵％"
                    v-model="coupon.percent"
                  />
                </div>

                <div class="form-group">
                  <label for="due_date">有效期限</label>
                  <input
                    type="date"
                    class="form-control"
                    id="due_date"
                    placeholder="請輸入有效期限"
                    v-model="coupon.due_date"
                  />
                </div>

                <div class="form-group">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="is_enabled"
                      v-model="coupon.is_enabled"
                      :true-value="1"
                      :false-value="0"
                    />
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateOrNewCoupon">確認</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="delCouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠卷</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ coupon.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon">確認刪除</button>
          </div>
        </div>
      </div>
      <!-- delete coupon-->
    </div>
    <!-- Modal end -->
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: "CouponList",
  data() {
    return {
      coupons: [],
      coupon: {},
      isNew: false,
      isLoading: false,
      pagination: {}
    };
  },
  methods: {
    getCoupons(page = 1) {
      this.isLoading = true;
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`;
      const vm = this;
      this.$http.get(api).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          vm.isLoading = false;
          vm.coupons = response.data.coupons;
          vm.pagination = response.data.pagination;
        } else {
          this.$bus.$emit("message:push", response.data.message, "danger");
        }
      });
    },
    updateOrNewCoupon() {
      let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
      let httpmethod = "post";
      if (!this.isNew) {
        api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${this.coupon.id}`;
        httpmethod = "put";
      }
      const vm = this;
      vm.coupon.due_date = Date.parse(vm.coupon.due_date);
      this.$http[httpmethod](api, { data: vm.coupon }).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          $("#couponModal").modal("hide");
          vm.getCoupons();
        } else {
          console.log(httpmethod);
          console.log("更新失敗");
        }
      });
    },
    deleteCoupon() {
      const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${this.coupon.id}`;
      const vm = this;

      this.$http.delete(api).then(response => {
        // console.log(response.data);
        if (response.data.success) {
          $("#delCouponModal").modal("hide");
          vm.getCoupons();
        } else {
          console.log("刪除失敗");
        }
      });
    },
    openModal(isNew, item) {
      this.isNew = isNew;
      if (!isNew) {
        this.coupon = Object.assign({}, item);
      } else {
        this.coupon = {};
      }
      $("#couponModal").modal("show");
    },
    openDelCouponModal(item) {
      this.coupon = Object.assign({}, item);
      $("#delCouponModal").modal("show");
    }
  },
  created() {
    this.getCoupons();
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
</style>
