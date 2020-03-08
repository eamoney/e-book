<template>
  <div class="ebook">
   <ebook-title/>
   <ebook-reader/>
   <ebook-menu/>
  </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader.vue'
import EbookTitle from '../../components/ebook/EbookTitle.vue'
import EbookMenu from '../../components/ebook/EbookMenu.vue'

export default {
  name: 'ebook',
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  }
}
</script>
