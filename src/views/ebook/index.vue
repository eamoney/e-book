<template>
  <div class="ebook">
   <ebook-reader/>
  </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader.vue'

export default {
  name: 'ebook',
  components: {
    EbookReader
  }
}
</script>
