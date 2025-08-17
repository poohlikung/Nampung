<script setup>
import { useTableStore } from './store/table';
import { useQueueStore } from './store/queue';
import { useTransactionStore } from './store/transaction';

const tableStore = useTableStore();
const queueStore = useQueueStore();
const transactionStore = useTransactionStore();

onMounted(async () => {
  await tableStore.fetchTables();
  await queueStore.fetchQueues();
  await transactionStore.fetchTransactions();
});
</script>

<template>
  <VApp>
    <RouterView />
  </VApp>
</template>
