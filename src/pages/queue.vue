<script setup>
import InfoCard from "@/components/cards/InfoCard.vue";
import moment from "moment";
import 'moment/dist/locale/th';

import { useQueueStore } from "@/store/queue";
import { useTableStore } from "@/store/table";
import { computed } from "vue";

moment.locale('th');

const queueStore = useQueueStore();
const tableStore = useTableStore();



const addQueueDialog = ref(false);
const quueuInitData = ref({
  name : "",
  people : 1,
  phone : "",
  status : "waiting",
  timestamp : "" 
});
const formats = [
  {md: 12, datatype: 'text', target: 'name', validation: ['required'], props: { label: 'ชื่อผู้จองคิว *', clearable: true } },
  {md: 6, datatype: 'text', target: 'people', props: { type:"number", label: 'จำนวนคน', clearable: true } },
  {md: 6, datatype: 'text', target: 'phone', props: { label: 'เบอร์โทรศัพท์', clearable: true } },
]
const enqueue = async (queue) => {
  await queueStore.enqueue(queue);
};
const dequeue = async (target) => {
  if(queueStore.queues.length === 0){
    return;
  }
  let queue = target || queueStore.queues[0];
  await queueStore.dequeue(queue);
};

const tableAvailable = computed(() => {
  return tableStore.tables.filter(table => table.status !== 'reserved').length;
  // return tableStore.table.filter(table => table.stats !== 'reserved').length;
  // return tableStore.tables.filter(ta)
});
</script>
<template>
  <VCard :loading="queueStore.loading" :disabled="queueStore.loading">
    <VCardItem>
      <VCardTitle>ระบบจองคิว</VCardTitle>
    </VCardItem>
    <VCardText>
      <VRow>
        <VCol cols="3">
          <InfoCard
            title="โต๊ะว่าง"
            :stats="tableAvailable"
            unit="ตัว"
            icon="mdi-table-plus"
            color="success"
          />
        </VCol>
        <VCol cols="3">
          <InfoCard
            title="ผู้รอคิว"
            :stats="queueStore.queues.length"
            unit="คน"
            icon="mdi-table-account"
            color="warning"
          />
        </VCol>
        <VCol cols="3">
          <VCard class="align-center justify-center d-flex fill-height">
            <VBtn                
              class="fill-height"
              block
              color="primary"
              @click="addQueueDialog = true"
            >
              <VIcon>mdi-plus</VIcon>
              เพิมคิวใหม่
            </VBtn>
          </VCard>
        </VCol>
        <VCol cols="3">
          <VCard class="align-center justify-center d-flex fill-height">
            <VBtn                
              class="fill-height"
              color="primary"
              block
              @click="dequeue()"
            >
              <VIcon class="me-2">mdi-account-voice</VIcon>
              เรียกคิวต่อไป
            </VBtn>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
  <VCard class="mt-5">
    <VList lines="two">
      <VListItem v-for="(item,index) in queueStore.queues">
        <VListItemTitle>{{item.name}}</VListItemTitle>
        <VListItemSubtitle>เข้ามาเมื่อ {{ new Date(item.timestamp).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }) }} ทั้งหมด {{ item.people }} คน</VListItemSubtitle>
        <template v-slot:prepend>
          <VAvatar color="primary"><span class="text-h5 text-white">{{ index+1 }}</span></VAvatar>
        </template>
        <template v-slot:append>
          <span class="text-h6 me-2">รอมาแล้ว {{ moment(item.timestamp).fromNow() }} </span>
          <VBtn @click="dequeue(item)" color="success" class="me-2"><VIcon>mdi-account-voice</VIcon> เรียกคิว</VBtn>
        </template>
      </VListItem>      
    </VList>    
  </VCard>
  <AddDialog 
    v-model:isDialogVisible="addQueueDialog"     
    :data="quueuInitData" 
    title="เพิ่มคิวใหม่" 
    :format="formats" 
    @submit="enqueue"
  />
</template>
