<script setup lang="ts">
const { api, me } = useAdm()
const s = ref<any>(null)
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
const period = ref({ from: iso(new Date(Date.now() - 29 * 86400000)), to: iso(new Date()) })
async function load() { s.value = await api('GET', '/summary?x=1' + periodQS(period.value)) }
watch(period, load, { deep: true }); onMounted(load)
const max = computed(() => Math.max(1, ...(s.value?.days || []).map((x: any) => (+x.sales_kop + +x.topups_kop))))
const fmtRange = computed(() => s.value ? `${d(s.value.period.from)} — ${d(s.value.period.to)}` : '')
const hello = computed(() => { const h = new Date().getHours(); return h < 5 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер' })
const today = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
const todo = computed(() => s.value ? [
  { to: '/admin/orders', n: +s.value.orders_open + +(s.value.orders_need_info || 0), t: 'Заказы в работе', h: s.value.orders_need_info ? `ждут данных от клиента: ${s.value.orders_need_info}` : 'оплачены, ждут выдачи' },
  { to: '/admin/kyc', n: +s.value.kyc_pending, t: 'Верификация', h: 'паспорта на проверке, по порядку' },
  { to: '/admin/refunds', n: +s.value.refunds_new, t: 'Возвраты', h: 'новые заявки' },
  { to: '/admin/chats', n: +(s.value.chats_waiting || 0), t: 'Чаты', h: 'клиенты ждут ответа' },
] : [])
const todoTotal = computed(() => todo.value.reduce((a, x) => a + x.n, 0))
const topMax = computed(() => Math.max(1, ...(s.value?.top || []).map((x: any) => +x.kop)))
</script>
<template>
  <div v-if="s" class="dash">
    <div class="dash-hello">
      <div><span class="dash-date">{{ today }}</span><h1>{{ hello }}, {{ me.admin?.name || me.admin?.login }}</h1></div>
      <div class="dash-rate"><span>курс ЦБ сейчас</span><b>{{ s.rate }} ₽</b><span>за $1</span></div>
    </div>

    <div class="dash-row">
      <section class="dash-todo">
        <div class="dt-head"><h2>Нужно разобрать</h2><span class="dt-total">{{ todoTotal }}</span></div>
        <NuxtLink v-for="x in todo" :key="x.to" :to="x.to" :class="['dt-item', { zero: !x.n }]">
          <span class="dt-n">{{ x.n }}</span><span class="dt-t"><b>{{ x.t }}</b><span>{{ x.h }}</span></span><i class="pi pi-arrow-up-right" />
        </NuxtLink>
        <p v-if="!todoTotal" class="dt-empty"><i class="pi pi-check-circle" /> Очередь пустая — всё разобрано</p>
      </section>
      <aside class="dash-bal">
        <span class="db-k">На балансах клиентов</span>
        <b class="db-v">{{ kop(+s.balances_kop) }}</b>
        <span class="db-s">пользователей всего — {{ s.users_total }}</span>
        <NuxtLink to="/admin/users" class="db-link">Открыть клиентов <i class="pi pi-arrow-right" /></NuxtLink>
      </aside>
    </div>

    <section class="panel dash-period">
      <div class="dp-head"><div><h2>Итоги</h2><span class="muted">{{ fmtRange }}</span></div><AdmPeriod v-model="period" /></div>
      <div class="dp-ticker">
        <div><span>Продажи</span><b>{{ kop(+s.period.sales_kop) }}</b><em>{{ s.period.orders }} заказов · {{ s.period.buyers }} покупателей</em></div>
        <div><span>Пополнения</span><b>{{ kop(+s.period.topups_kop) }}</b><em>возвраты {{ kop(+s.period.refunds_kop) }}</em></div>
        <div><span>Новые клиенты</span><b>{{ s.period.users_new }}</b><em>прошли KYC: {{ s.period.kyc_approved }}</em></div>
        <div><span>Посетители</span><b>{{ s.period.visitors }}</b><NuxtLink to="/admin/analytics">в аналитику →</NuxtLink></div>
      </div>
    </section>

    <div class="dash-two">
      <section class="panel">
        <div class="dp-head"><h2>По дням</h2><div class="legend"><span><i style="background:#12B76A" />продажи</span><span><i style="background:#C8F542" />пополнения</span></div></div>
        <div v-if="s.days.length" class="chart">
          <div v-for="x in s.days" :key="x.day" class="col" v-tooltip.top="`${d(x.day)}: продажи ${kop(+x.sales_kop)}, пополнения ${kop(+x.topups_kop)}`">
            <div class="bar t" :style="{ height: (x.topups_kop / max * 100) + 'px' }" />
            <div class="bar" :style="{ height: (x.sales_kop / max * 100) + 'px' }" />
            <span v-if="s.days.length <= 31" class="lbl">{{ x.day.slice(8) }}</span>
          </div>
        </div>
        <p v-else class="muted">Период больше 3 месяцев — график по дням не строим, смотрите итоги выше.</p>
      </section>
      <section class="panel">
        <div class="dp-head"><h2>Что покупают</h2></div>
        <ol v-if="s.top.length" class="dash-top">
          <li v-for="(x, i) in s.top" :key="x.product_name">
            <span class="dtp-i">{{ i + 1 }}</span>
            <span class="dtp-b"><b>{{ x.product_name }}</b><span class="dtp-bar"><i :style="{ width: (+x.kop / topMax * 100) + '%' }" /></span></span>
            <span class="dtp-v"><b>{{ kop(+x.kop) }}</b><span>{{ x.n }} шт.</span></span>
          </li>
        </ol>
        <p v-else class="muted">Заказов за период нет</p>
        <div v-if="s.low_keys.length" class="dash-keys"><h3>Заканчиваются ключи</h3>
          <p v-for="k in s.low_keys" :key="k.slug"><NuxtLink :to="'/admin/products/' + k.slug">{{ k.name }}</NuxtLink> — свободно {{ k.free }}</p></div>
      </section>
    </div>
  </div>
</template>
