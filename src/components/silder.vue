<script lang="ts">
export default {
  name: 'silder',
}
</script>
<script setup lang="ts">
    import { ref, reactive ,watch ,onMounted, computed ,onUpdated } from 'vue'
    import { useRouter } from 'vue-router'
    import { showToast } from 'vant'
    import { vantLocales } from '@/lang'
    import { useI18n } from 'vue-i18n'
    import { useStore } from 'vuex'
    import { useToken } from '@/common/useToken';
    const { getToken, removeToken } = useToken();
    const $store = useStore();
    const { locale , t } = useI18n();
    const props = defineProps(["silderflog"]);
    let $emit = defineEmits(["update:silderflog"]);
    const router = useRouter();
    const activeNames = ref('0');       //导航索引

    // 用户信息
    const userStore = computed(()=>$store.state.userinfo);
    const loginStore = computed(()=>$store.state.login);
    const WebConfig = computed(()=>$store.state.webconfig);
    // 导航数据
    const silderData:any = reactive({data:[
        {title:t('silder.menu1'),url:'/'},
        {title:t('silder.menu2'),url:'/assetcenter'},
        {title:t('silder.menu3_1'),url:'/',child:[
            {title:t('silder.menu3_1'),url:'/mining'},
            {title:t('silder.menu3_2'),url:'/mining/faq'},
            {title:t('silder.menu3_3'),url:'/mining/profitrecord'},
        ]},
        {title:t('silder.menu4_1'),url:'/',child:[
            {title:t('silder.menu4_1'),url:'/options'},
            {title:t('silder.menu4_2'),url:'/options/trade'},
            {title:t('silder.menu4_3'),url:'/options/opdetaile'},
        ]},
		{title:t('silder.menu5'),url:'/officialActivity'},
		{title:t('silder.menu6'),url:'/share'},
		{title:t('silder.menu7'),url:'/about'},
        {title:t('silder.menu8'),url:'/',type:'add',child:[
            {title:t('silder.menu8_1'),url:'/proclamation'},
            {title:t('silder.menu8_2'),url:WebConfig.value['white_paper'],useAtag:true,ukey:'white_paper'},
            {title:t('silder.menu8_3'),url:WebConfig.value['terms_of_service'],useAtag:true,ukey:'online_kefu'}
        ]},
    ]})
    // username.replace(/(\w*)(\d{4})/, "$1****")
    // var reg = /^(\d{4})(\d*)(\d{4})$/
    // 复制
    const onCopy = (val:string) => {
        navigator.clipboard.writeText(val)
      .then(() => {
        showToast('copy successfully');
      })
      .catch(() => {
        showToast('copy failed');
      })
    }
    
    // 遮罩层
    const handlemouseClick = (event:MouseEvent) => {
        let setX = document.documentElement.clientWidth*0.7;
        if(event.pageX > setX){
            $emit("update:silderflog",!props.silderflog);
            activeNames.value = '0';
        }
    }
    const langShow = ref<boolean>(false);
    const langVal = ref<string>('');
    const langIndex = ref<number>(0);
    const languageArr = [
        {text:'繁体',value:'zh',ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAcCAYAAAAX4C3rAAAAAXNSR0IArs4c6QAAAgtJREFUWEftmM1rE0EYxn/vzDYNUUuQ2i/FQ5QWBREERb2JgjZ6kYLiwT+i/4gePXlW8SDiQUREo4fWgzfx1ApqsfEjGEuoMe7OK1kPWpM0290NFcyelp15n+c3z3zAjgA8Pr1nrxh7FeGoIMPNb5v9KPpZVOZ8gtmT9xcWpVQsHICBeSC32XBt/ZUa8uO4PClO3hPk3EYgt+wXtA6rr3UjZQn66l0pTU9VELa3qBjF2yr4K3+1GCV/xIJVqnMOnCQAiFiq+lFKxam2seQKwuAu4ctT117NaAgpGVD/13svn46gozOWzIjw7prf0V88GL9kWXnhqL3q7TJYA+rlYfyiR3anWQPnf1WWb/vU37bCNJOvlxW32ss8oTVRo4ye9xg6aEPnb28c72/4PQfpNsy2Uz88bckfNrgGND4pS9fXn37t3NzNP3J7W9CJy5bKwwC/BmMzlg93gtbdD5gsjJy1VJ8H1Jcie8bq2ALa3CAY0MZvPZOj49QPHZLwPPWrsfwjF3Xc9d0UwmPpj8F065+0PRbojqLFfYfKoyCpf+T6WKCDE6AOGuXIPok7xgJN7BpDoA8aI7R1S/qJ9hNNO4G09fpr9L9OdBkYSzuBlPXKUjozeQsjF1IWTlVOVW/Ks1OF3S4z8BLYlqp6SmKq1LIE+8J/3OaVjjHeFRU99i9d6aDMqwtmTzxYXPgJ3T/JhU+DN7EAAAAASUVORK5CYII='},
        {text:'English',value:'en',ico:'data:image/png;base64,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'},
        {text:'日本',value:'jap',ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAcCAIAAACYgrq8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTA3LTEzVDE5OjIwOjI5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNy0xM1QxOToyNDoyMyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wNy0xM1QxOToyNDoyMyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozMGQ3ZjgzMi0yZjkyLWY0NDQtYWUwZC1kMGEwN2ZjNjlhNGIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDowM2M4MTVkZS04OThlLWQzNDItOWU0OS01YmQzNDhjNjBkNWUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNjRjYWI1Yy04Mjk4LTFjNGItOGNkYS05YWU2MjA3MmYxYmUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjE2NGNhYjVjLTgyOTgtMWM0Yi04Y2RhLTlhZTYyMDcyZjFiZSIgc3RFdnQ6d2hlbj0iMjAyMi0wNy0xM1QxOToyMDoyOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozMGQ3ZjgzMi0yZjkyLWY0NDQtYWUwZC1kMGEwN2ZjNjlhNGIiIHN0RXZ0OndoZW49IjIwMjItMDctMTNUMTk6MjQ6MjMrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6YlMJKAAABm0lEQVRIx+3WP0iCQRzGcR1ycDAbxHeRpt52cRMRFByihlqcWkRoc7GptUUaE4JAHFzCpaCEsNVNUCcTBwsRFAtaTF6t9+XbIESE4Ht55lDHs3+4435/LCz1WP75JfK6ri/LNgzjR7yu8/REtUqhwPU15TK9Hm9vv8I/PpJOs7eHz4eqoqp4vezscHJCo7FI3jC4uiIcxuHAYvkeu51AgFzO/DOI8LpOPs/6+hT4axSFszM0TTZfKuHxzLAncbkoFqXy/T4HB6bsSXZ3abfl8Xd3rK0J8DYbFxeSeE0jlRKwJ0kmeXmRwXe7xOPC/Pb2zDo0xz88EI0K84EAtZoMvtMhFhPmt7a4v5fBD4ccHwvziQTPz5J+fqGA3S5gr6yQy8krvG6X/X0BPhKh1ZLa9YpF3G5T9uoql5eym+54zPk5LtcM2+kklWIwWMDEG43IZvH7sVqn2z4fp6e8vi5y3tfrHB0RCrG5iaKgKGxsEAxyeEilgmEsftvRNFotbm/JZslkuLmh2TR/6bn5z/P+/oMdSx4//6r5p/f8D1xQ2OIcufD0AAAAAElFTkSuQmCC'},
        {text:'한국인',value:'kr',ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAcCAYAAAAX4C3rAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTA3LTEzVDE5OjIwOjI5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNy0xM1QxOToyMzowNiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wNy0xM1QxOToyMzowNiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpiNGQxZWNjNC1hODIyLWExNGMtYThkNy0xN2EwNjczZjA3Y2EiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpkMDZhMDVhMC1jYmVlLTU5NDQtOWFlNi1mNmE5NjY0NGE5MzgiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmZTZmNWQwNC0zNTgzLThiNDYtYTU5YS00ZjRiNzYyNjhmZDAiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmZlNmY1ZDA0LTM1ODMtOGI0Ni1hNTlhLTRmNGI3NjI2OGZkMCIgc3RFdnQ6d2hlbj0iMjAyMi0wNy0xM1QxOToyMDoyOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNGQxZWNjNC1hODIyLWExNGMtYThkNy0xN2EwNjczZjA3Y2EiIHN0RXZ0OndoZW49IjIwMjItMDctMTNUMTk6MjM6MDYrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4072mWAAAFUUlEQVRYw82Ye0zTVxTHf/OBDjYMClH/YIDA2KDUUVu0ZcHJwwrLhEVgZqwLGFm2qaBbXBDwRVSeEgKYBVAKbmAUWJhI/GeBLIDbeG0TGEEY2RaGg/Eqryq0/e7ey+aofYqGcJKTNr/ee36f3znnnnN+5Xp7ezEyMrKslTJyExMTWO5CGTlKbI4MDAw8c4D79++btY4ymgXa2dmJTZs2oaGhAeY+mDGZmppCT08PnJ2dUVVV9WxANRoNhEIhIiIiEB4ejqioKOYJtVr9xIDUFt2bkpICiUSC48ePw8bGxmS0zAJNS0tj3rx06RIzmp2djS1btiwqFcbHx5kXL1y4ACcnJyQmJmLv3r0oLy9/OtCOjg6sWbMGeXl5cHBwQHJyMgQCAaKjow3uUT94ALVSafD3jIwMbNiwARcvXoSVlRXq6+sRGhqKysrKxYFOT0/Dzc0NMTExCAsLQ3BwMOLi4uDo6MhybKGoFBMYvHoN3e9/iI6gMLTv2Yeu/dEYyCvAw35dz0dGRjKwY8eOwcPDAwkJCUZTgIFOGAClT+rl5YVz587Bzs4OhYWFWLlyJTtQC0Vxpwl3d4eiydETza5eaHlFSFSE5pcF5BoPP4oDMPx1jU6uBgYGIjU1lYEeOXIEAQEByM/P11+eKKjKAOjc3ByGh4exa9cuJCUlwdXVFUePHtWGbPgerVslBFCAVr5Er1Jw+gB/V97U2kvTydraGllZWeDxeOjr68MDkjb6hDJympFRo4k8OTmJ0tJS8Pl8zMzMPLr+cEyBVv8QtBiBfAT7qghtAl8of+3Tsh0UFMScoFAojFcLwsipTYCyA0JK0eMd7LvS27jjtNUgXLvndnR7Cpm287ez1Pj9bKqWDSU5dIa8qHV/c0F1QkE0Je5ztLi8pgPYRrTLU4QKQTASdsQgccdBfEW+d7ry8cu+96BZRP1dNOiIUg3RO5fR4D7vuYWQPZ7bcEJ8EM9L5eCCrjG1lBbh5DYZenZKoZqcWjpQxfQs1u2vwFviz/ATX4xe3jbc4wnRQz4zvCOxQnoV3J4vwEmL55V8X+F/BTf8ZWTz2NKBkuoCySe3wb1RDJ5fBmIlHyGehHiP70k8x+Cu/g/5n/qV4OPILHIKZ5YOlEpScRs4SQHx1pdEy/7VUgJVogtJ9fVCfHr25qLuNQ86ahqUTjghISFa1/4YmsK6twmY3xX9YAs1UM7W/fBzv5aNw4cPIz093TQoYeQ0SsOgs7OzbGI6f/481q9fz4rzQin5hkzeOy8TiCLjkOJ8JMjbtPZWV1ezTkdBpVIpBgcHDacaYeSgGTXYQulkQ7sRnZaowdWrV6O7u1trXcHte3jhTZKTPgXz3g0g0AHyeXgS7hX+RThR1KpjXywWs9nB19eXzRJ0fJTL5QZIKahaP+jQ0BBsbW3ZwEDbKPWmTCaDt7c369ULpf23MXyQ1QhnWTmsSTq8GFqKl969gYjkOnx79y8d26dPn0ZZWRkqKirY4EN7/tq1a9mAbiD2hkGp1NbWsvDU1NQgPj4eubm5sLe3x5kzZ/SuVz5UYWBkBn8OT2NKOad3zfXr12FhYcHm2gMHDjCH+Pj4ICcnx1iSGgelcujQIbi7uzMvbN68md2Aetrc953HB2dqg/Z3kUjExj16oKh3TZwm06B0LqVejI2NZSlAw9/U1MT69JMKnchaWlpw6tQpuLi4IDMzE6tWrUJXV9fTg1Kpq6uDpaUlbt26ZdqoGdLf34/GxkZs3LiRveKYUZ8oqHlvldSLtFw9S2luboZKpTKn4lPQ5f8HBGXkNLP9ao1aodGoxrEslbIRxn8AHfnqZUBuVHMAAAAASUVORK5CYII='},
        {text:'Français',value:'fr',ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAcCAYAAAAX4C3rAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTA3LTEzVDE5OjIwOjI5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNy0xM1QxOToyNjowNiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wNy0xM1QxOToyNjowNiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NWM4MGM4OC0xZTFiLWU1NGUtODAwOS1kOWQ4YWYyNzA5MmYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMGU5MTMyNy01MWMyLTllNGEtOTI5Zi02YzdmOTkwNDIzZWQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxZTAyNWRmYy03OWYyLWNlNDYtYTg2OS0zZDhmODUwMzdhOWUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjFlMDI1ZGZjLTc5ZjItY2U0Ni1hODY5LTNkOGY4NTAzN2E5ZSIgc3RFdnQ6d2hlbj0iMjAyMi0wNy0xM1QxOToyMDoyOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NWM4MGM4OC0xZTFiLWU1NGUtODAwOS1kOWQ4YWYyNzA5MmYiIHN0RXZ0OndoZW49IjIwMjItMDctMTNUMTk6MjY6MDYrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4vVxisAAAA30lEQVRYCdXBQUrDQBTH4d/7J0htIigiLjyHGy/gQTyRx/EkgvsuBEHEzrRNOvPEGyS7ed9n908v55RPMsNY4nvP+HDHx9sr47BhjbLPvD8+M+12dNc3LOLu2m5r//n107FGOkA+4vwz1qopU34T1l+wkNWUO10NG1qncUAEIYIQQYggRBAiCB1PhdadpoLOc6V181QQMponQwQhghBBiCBEEAKjfYZEoXUdBV36TOs2PiMnBhGAY4ggRBAiCBGEEh3Nc+hvmcsBycBYwipbCjUnKpU1ak5gjgkwlnIzr3+bgEuxCssNzQAAAABJRU5ErkJggg=='},
        {text:'Русский',value:'rus',ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAcCAYAAAAX4C3rAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTA3LTEzVDE5OjIwOjI5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNy0xM1QxOToyNTowMyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wNy0xM1QxOToyNTowMyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0MmIzNTFiMy04YzhiLTg0NDYtYTY4Mi02M2M2Mjk5NzIxMTUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxZTA4YzQzZi02MTQ1LWMxNDQtODFmNC02N2Q2NTQ0MWFkNjUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplNjMxN2UwMC0xOTY5LTgwNGEtODcxYS0yYTBlMGE3ZDNiYWQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmU2MzE3ZTAwLTE5NjktODA0YS04NzFhLTJhMGUwYTdkM2JhZCIgc3RFdnQ6d2hlbj0iMjAyMi0wNy0xM1QxOToyMDoyOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0MmIzNTFiMy04YzhiLTg0NDYtYTY4Mi02M2M2Mjk5NzIxMTUiIHN0RXZ0OndoZW49IjIwMjItMDctMTNUMTk6MjU6MDMrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz47xPu/AAAA0ElEQVRYCdXBsVEDMRRF0fu+ZC/jYcYEJGQUQAU0RCuElOVGIGEInDBe7UoPyvg6R7Y/7XH21hb3UcAiBVklug7HVYqr/I8JxGi3neRGu+3hPgrJuY8SYJGeFUwimEQwiWAS9e39wlbuyOzQb+j09OHffiSzU2lUns/gI6mpEUwimEQwiWASwSQq8QheSE0r9bVdWH0gs0Ub+n55cAyT2QhRf3SPZDKzRN0JRG4GgkkEkwiMyc44gE5+PWQqycnUCnwBZ4sFKAiRgTHQZVbg+genB1KhV/oUbwAAAABJRU5ErkJggg=='},
        {text:'Deutsch',value:'ger',ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAcCAYAAAAX4C3rAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTA3LTEzVDE5OjIwOjI5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNy0xM1QxOToyMTo1NyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wNy0xM1QxOToyMTo1NyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNzQ4NWYwMi00Y2U1LTAxNGYtOTI4Yy02MTk2MGI4NWM4ZDUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyM2RiMjNiMi0zMGJlLTVkNDgtYTIyNi1jNzNhZTkyYWE0NDAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowZWRmMTRjNi02NzJjLTUwNDktODMzZS1lYWVmOTZlZTVkMzkiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBlZGYxNGM2LTY3MmMtNTA0OS04MzNlLWVhZWY5NmVlNWQzOSIgc3RFdnQ6d2hlbj0iMjAyMi0wNy0xM1QxOToyMDoyOSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNzQ4NWYwMi00Y2U1LTAxNGYtOTI4Yy02MTk2MGI4NWM4ZDUiIHN0RXZ0OndoZW49IjIwMjItMDctMTNUMTk6MjE6NTcrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6tnAa0AAAAf0lEQVRYCdXBsRVBURRFwX3f3xJrSUi1oBOtyOV6FQoEBL77tOHMOMaYBLC7SSAhJISEkBASQkJ4ZiGBNySBR4oEPslgkUFCSAgJYZPBZV8k8HAtEri7NAnkTgQpIkgICSEhhEkCYSWB7z49ZrP0h+38ToHiP8xaWMemXjX4/gAUzRpg2xZWTQAAAABJRU5ErkJggg=='},
        {text:'español',value:'es',ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAARCAYAAADHeGwwAAAB9UlEQVQ4jbWVzWtTQRTFf/Nm3iRp8tqIXw0WiiCi4qIuBDe6VkEE9/b/8G/QrVt3Lt24FtSNrqtYLILUFpTUaDSf7+XNh7yXEAiB8kLrWQ3M3Hvm3HPvjOjduOfdqI8oVTlu+GSAaFPxjiGCyvETMEQFpQYkXUQ5mjtwZIK4h3KJxiERsZ47cGSCLO/oSeR9miJUOLMZYJFhCtLh0hBrFSDmkhwGb1KE7+KxecYZOC3p9E/Q/1vhbKOJciNw+bWKw4FiFzCAnIQJsBLazVMcvDpDurdPfFrTeBiiSwOU9cVJ7Ny9gRB+d0Pk9xYnv30hOn+L+t2b/Op62k0NC1o1S5CVeAD1tTvEb6+z88FTizcRXx9Tq2xSX16HdC7HoZglkOAlDF4sU40SmlfO8Xx3B9l6SvIyJd6OYMFuFv4jfuqByJzPSvcA09lm+H6PrTc1locHXH10n2D1J0q/G3tWBDYzeW1i8kSLCOCT0tT3Hau3q1y4dI3yj9d83nCsLFnWzQKd5ECkz5a8Tw1CqWmbD9MIXY6RIZiwRln/odeqEFiLVklhAm9M9hZd9I4OgpXpRoDBTyQJDI4wHzyPyKezKDwdVKANjCyiNNseIp++8SojHK8yimzaCipILMqPWuQKkqRwYHEFXZS8vEGQ9BHl//AfxH3+ATugxR9BROg/AAAAAElFTkSuQmCC'},
    ]

    // 清除缓存
    const handleReCache = () => {
        window.sessionStorage.clear();
        removeToken();
        document.cookie = "cookieName=; path=/;";
        setTimeout(() => {
            location.reload();
        }, 200);
    }

    // 切换语言
    const onSelectLanguage = (ev:any) =>{
        location.reload();
        let lang = ev.target.dataset.value;
        localStorage.setItem("language", lang);
        setTimeout(() => {
            //切换vant组件语言
            vantLocales(lang)
            //切换页面中的语言
            locale.value = lang;
        }, 500);
    }

    // 关闭导航栏
    const onOutLogin = () => {
        $emit("update:silderflog",!props.silderflog);
        activeNames.value = '0';
    }

    // 特殊跳转 白皮书，服务条款
    const onBlank = (val:any) => {
        if(WebConfig.value[val]){
            window.open(WebConfig.value[val])
        }
    }

    onMounted(()=>{
        langVal.value = localStorage.getItem("language") || (navigator.language || 'en').toLocaleLowerCase().split('-')[0];
        langIndex.value = languageArr.map((item:any)=>item.value).indexOf(langVal.value);
    })

    onUpdated(()=>{
        let navwrap = document.querySelector('#nav-wrap')!;
        navwrap.addEventListener('touchmove', e => e.stopPropagation(),false);
    })

    watch(() => router.currentRoute.value,(newValue: any,oldValue: any) => {
        $emit("update:silderflog",false);
        activeNames.value = '0';
    },
    { immediate: true }
    )

</script>

<template>
    <div class="silder-box">
    <van-overlay :show="silderflog" @click="handlemouseClick">
        <div id="nav-wrap">
        <div class="nav-wrap" >
            <div class="sub-menu-wrap">
                <van-collapse v-model="activeNames" accordion>
                    <!-- 用户信息 -->
                    <div class="user-wrap" v-show="loginStore">
                        <div class="user-cross"><van-icon name="cross" @click="onOutLogin"/></div>
                        <div class="user-info">
                            <div class="user-avatar"><img src="../assets/silder/userava.png"></div>
                            <div>
                                <div class="user-name">{{ userStore['address']? userStore['address'].replace(/^(.{4})(?:\w+)(.{4})$/,"$1****$2") : '' }}</div>
                                <div class="user-id">Invite: {{ userStore['id'] }} <van-icon color="#4366EA" name="brush-o"/></div>
                                <div class="user-score">Credit Score:100</div>
                            </div>
                        </div>
                        <van-divider />
                    </div>
                    
                    <div class="sub-menu-list" v-for="(item,index) in silderData.data" :key="index">
                        <!-- excluding children -->
                        <van-row v-if="!item.child || !item.child.length" class="sub-menu-item">
                            <a v-if="item.useAtag" @click="()=>onBlank(item.ukey)" target="_blank">{{ item.title }}</a>
                            <router-link v-else :to="item.url">{{item.title}}</router-link>
                        </van-row>
                        <!-- Including children -->
                        <van-collapse-item v-else :title="item.title" title-class="sub-menu-coll">
                            <van-row v-for="(items,indexs) in item.child" :key="indexs" class="sub-menu-item" :class="{'items':items}">
                                <a v-if="items.useAtag" @click="()=>onBlank(items.ukey)" target="_blank">{{ items.title }}</a>
                                <router-link v-else :to="items.url">{{items.title}}</router-link>
                            </van-row>
                        </van-collapse-item>
                    </div>

                </van-collapse>
                <!-- end -->
                <div class="sun-menu-footer">
                    <div class="removeCookie" @click="handleReCache">{{$t('silder.clearcache')}}</div>
                    <!-- language -->
                    <div class="languagebox" @click="langShow = !langShow">
                        <div class="language-ico">
                            <img :src="languageArr[langIndex].ico"  >
                            <span>{{languageArr[langIndex].text}}</span>
                        </div>
                        <van-icon name="arrow-down" />
                    </div>

                    <div class="language-list" v-show="langShow" @click="onSelectLanguage">
                        <div class="language-item" v-for="(item,index) in languageArr" :key="index">
                            <div class="language-mask" :data-value="item.value" :data-index="index"></div>
                            <div class="language-ico"><img :src="item.ico" ></div>
                            <span>{{item.text}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </van-overlay>
    </div>
</template>

<style lang="less">
@import url('@/assets/css/reset.less');
@themeBgColor:#fff;
.menuFontStyle(){
    color: #4d4d4d;
    font-size: 16px;
    font-weight: 600;
}
.flex-dom(@justify){
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: @justify;
    justify-content: @justify;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}

.nav-box{
    background-color: @themeBgColor;
    height: 60px;
    .flex-dom(space-between);
    box-shadow: 0 4px 4px rgba(97,6,243,.04);
    padding: 0 16px;
    .nav-left{
        height: 40px;
        .flex-dom(space-between);
        gap: 8px;
        .logo{
            min-width: 150px;
            height: 37px;
            -webkit-animation: scalelogo 1.5s 0s ease both infinite;
            -moz-animation: scalelogo 1.5s 0s ease both infinite;
            animation:scalelogo 1.5s 0s ease both infinite;
        }
    }
    .nav-right{
        width: 114px;
        height: 39px;
        border-radius: 6px;
        color: #fff;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        background: -webkit-linear-gradient(right,#607cff,#4570fe);
        background: linear-gradient(270deg,#607cff,#4570fe);
        border-radius: 15px;
        .flex-dom(center);
        .nav-addre-txt{
            padding-left: 5px;
            font-size: 15px;
        }
    }
}


.loading-img{
    height: 2rem;
    width: 2rem;
    -webkit-animation: rotateanime 4s infinite linear;
    -moz-animation: rotateanime 4s infinite linear;
    animation: rotateanime 4s infinite linear;
}
// 导航栏 start

@menuFontColor:#4d4d4d;
.silder-box{
    --van-overlay-z-index:99;
}
#nav-wrap{
    height: 100vh;
.nav-wrap{
    text-align: left;
    width: 70%;
    height: 100%;
    overflow: scroll;
    background: #fff;
    z-index: 99;
        .sub-menu-wrap {
            padding: 16px 0 30px 10px;
            // 用户信息
            .user-wrap{
                .user-cross{
                    text-align: right;
                    font-size: 21px;
                    padding-right: 15px;
                    color: #3b3b3b;
                }
                .user-info{
                    .flex-dom(flex-start);
                    font-size: 12px;
                    line-height: 20px;
                    .user-avatar{
                        height: 35px;
                        width: 35px;
                        margin-right: 10px;
                        img{width: 100%;
                        height: 100%;}
                    }
                    .user-name{
                        color: black;
                        font-weight: bold;
                    }
                }
            }
            .sub-menu-list{
                padding: 3px 0;
                    a{
                        .menuFontStyle();
                    }
                    .sub-menu-item{
                        padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
                        overflow: hidden;
                        color: var(--van-cell-text-color);
                        font-size: var(--van-cell-font-size);
                        line-height: var(--van-cell-line-height);
                        background: var(--van-cell-background);
                        text-transform: capitalize;
                    }
                    .sub-menu-item.items{
                        padding: 0;

                        a{
                            font-weight: normal;
                            font-size: 14px;
                        }
                    }
                    .sub-menu-item.items:not(:nth-child(1)){
                        padding: 12px 0 0;
                    }
            }
            
            }
}
}


  .sub-menu-coll{
    .menuFontStyle();
  }
// 导航栏 end
.cusnav-wrap{
  margin-bottom: 20px;
}

.sun-menu-footer{
    padding: 0 10px;
    .removeCookie{
        color: #424EFF;
        font-size: 14px;
        margin: 15px 0 35px 5px;
    }
    .languagebox{
        width: 150px;
        font-size: 14px;
        .flex-dom(space-between);
        border: 1px solid lightgrey;
        border-radius: 5px;
        padding: 5px;
    }

    .language-list{
        width: 150px;
        border-radius: 5px;
        border: 1px solid #f5f5f5;
        padding: 5px;
        margin-top: 8px;
        .language-item{
            .flex-dom(flex-start);
            padding-bottom: 10px;
            position: relative;
            .language-mask{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: transparent;
                z-index: 99;
            }
        }
    }
    .language-ico{
            img{
                width: 24px;
                height: 17px;
                position: relative;
                top: 3px;
                margin-right: 10px;
            }
        }
}

  @keyframes scalelogo{
    0% {
        --webkit-transform: scale(1);
        transform: scale(1);
    }
    50% {
        --webkit-transform: scale(1);
        transform: scale(.9);
    }
    100% {
        --webkit-transform: scale(1);
        transform: scale(1);
    }
  }
  @keyframes rotateanime{
    0% {
        --webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        --webkit-transform: rotate(1turn);
        transform: rotate(1turn);
    }
  }
</style>