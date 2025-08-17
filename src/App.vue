<script setup>
import { useQueueStore } from './store/queue';
import { useTableStore } from './store/table';

const tableStore = useTableStore();
const queueStore = useQueueStore();

onMounted(async () => {
  await tableStore.fetchTables();
  await queueStore.fetchQueues();
});
</script>

<template>
  <VApp>
    <RouterView />
  </VApp>
</template>
