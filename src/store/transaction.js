import { defineStore } from "pinia";
import { call, db } from "@/firebase"

export const useTransactionStore = defineStore({
  id: "transaction",
  state: () => {
    return {
      transactions : [],
      loading : false
    }
  },
  actions: {
    async fetchTransactions(){
      // query from firestore
      this.loading = true
      // get all transactions
      this.loading = false
    },
    async addTransaction(transaction) {
      //generate id
      transaction.id = Math.random().toString(36).substr(2, 9)
      // created date
      transaction.created = new Date()
      this.transactions.push(transaction)
      let res = await call("billTable", {name : transaction.table});
      if(!res.success){
        console.log("error adding transaction")
      }
    }
  }
});
