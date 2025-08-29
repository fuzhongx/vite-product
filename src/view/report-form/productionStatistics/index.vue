<template>
<div>
  <ElTable :column="column" :data="tableData" fit></ElTable>
</div>
</template>

<script setup>
import EIForm from "@/components/fromConfig/EIForm.vue";
import ElTable from "@/components/TableConfig/ElTable.vue";

import column from "@/components/report-form/productionStatistics";

import { List_productionStatistics } from "@/requert/report-form/productionStatistics.js";
import { onMounted ,ref} from "vue";


onMounted(()=>{
  List()
})

const tableData=ref()

const List=()=>{
  List_productionStatistics().then(res=>{
    tableData.value=res.data.rows
  })
}

</script>

<style>

</style>