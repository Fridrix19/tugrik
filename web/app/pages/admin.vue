<script setup lang="ts">
import logo from '~/assets/logo.svg?url'
// оболочка админки: проверка входа, верхняя навигация в два уровня со счётчиками, быстрый поиск, обязательная смена пароля
const { api, me, can } = useAdm()
const beta = !!(useRuntimeConfig().public as any).beta   // бета: вход admin / admin, без смены пароля
const route = useRoute()
const ready = ref(false)
const counts = ref<any>({})
const isLogin = computed(() => route.path === '/admin/login')
useHead({ title: 'Админка — Tugrik', link: [{ rel: 'icon', type: 'image/svg+xml', href: logo }] })

async function loadMe() {
  const r: any = await $fetch('/api/admin/auth/me').catch(() => ({ admin: null, perms: [] }))
  me.value = { admin: r.admin, perms: r.perms || [] }
  if (!r.admin && !isLogin.value) return navigateTo('/admin/login')
  if (r.admin && isLogin.value) return navigateTo('/admin')
}
async function loadCounts() { if (me.value.admin) counts.value = await api('GET', '/summary', undefined, { quiet: true }).catch(() => ({})) }
let cT: any
onUnmounted(() => clearInterval(cT))
onMounted(async () => { await loadMe(); ready.value = true; cT = setInterval(() => { if (!isLogin.value && document.visibilityState === 'visible') loadCounts() }, 30000); if (me.value.admin?.must_change && !beta) pw.open = true; else loadCounts() })
watch(() => route.path, () => { if (!isLogin.value) loadCounts() })

// навигация в два уровня: группы сверху, разделы группы — вкладками под ними
const GROUPS = [
  { id: 'queue', label: 'Очередь', icon: 'pi-inbox', items: [
    { to: '/admin/orders', label: 'Заказы', perm: 'orders', n: () => (counts.value.orders_open || 0) + (counts.value.orders_need_info || 0) },
    { to: '/admin/kyc', label: 'Верификация', perm: 'kyc', n: () => counts.value.kyc_pending, warn: true },
    { to: '/admin/refunds', label: 'Возвраты', perm: 'refunds', n: () => counts.value.refunds_new, warn: true },
    { to: '/admin/chats', label: 'Чаты', perm: 'chats', n: () => counts.value.chats_waiting, warn: true },
  ] },
  { id: 'people', label: 'Клиенты', icon: 'pi-users', items: [
    { to: '/admin/users', label: 'Пользователи', perm: 'users' },
    { to: '/admin/reviews', label: 'Отзывы', perm: 'reviews' },
  ] },
  { id: 'shop', label: 'Витрина', icon: 'pi-box', items: [
    { to: '/admin/products', label: 'Товары и цены', perm: 'products' },
  ] },
  { id: 'data', label: 'Цифры', icon: 'pi-chart-line', items: [
    { to: '/admin', label: 'Сводка', perm: 'summary', exact: true },
    { to: '/admin/analytics', label: 'Аналитика', perm: 'analytics' },
    { to: '/admin/export', label: 'Выгрузки CSV', perm: 'export' },
  ] },
  { id: 'sys', label: 'Команда', icon: 'pi-shield', items: [
    { to: '/admin/admins', label: 'Админы', perm: 'admins' },
    { to: '/admin/settings', label: 'Настройки', perm: 'settings' },
    { to: '/admin/audit', label: 'Журнал действий', perm: 'audit' },
  ] },
]
const isOn = (i: any) => i.exact ? route.path === i.to : route.path.startsWith(i.to) && !(i.to === '/admin' && route.path !== '/admin')
const groups = computed(() => GROUPS.map(g => {
  const items = g.items.filter(i => can(i.perm)).map(i => ({ ...i, count: i.n ? i.n() || 0 : 0 }))
  return { ...g, items, count: items.reduce((a, i) => a + (i.warn || g.id === 'queue' ? i.count : 0), 0), to: items[0]?.to }
}).filter(g => g.items.length))
const current = computed(() => groups.value.find(g => g.items.some(isOn)) || groups.value[0])
const queueTotal = computed(() => groups.value.find(g => g.id === 'queue')?.count || 0)
const initials = computed(() => (me.value.admin?.name || me.value.admin?.login || '?').split(/\s+/).map((w: string) => w[0]).join('').slice(0, 2).toUpperCase())
const menu = ref(false)
const closeMenu = (e: MouseEvent) => { if (!(e.target as HTMLElement)?.closest?.('.tg-me')) menu.value = false }
onMounted(() => document.addEventListener('click', closeMenu)); onUnmounted(() => document.removeEventListener('click', closeMenu))
const search = ref('')
function go() {
  const v = search.value.trim(); if (!v) return
  const isOrder = /^tg-/i.test(v)
  navigateTo({ path: isOrder && can('orders') ? '/admin/orders' : '/admin/users', query: { q: v, ...(isOrder ? { status: 'all' } : {}) } })
  search.value = ''
}
async function logout() { await $fetch('/api/admin/auth/logout', { method: 'POST' }); me.value = { admin: null, perms: [] }; navigateTo('/admin/login') }
const pw = reactive({ open: false, old: '', new: '', busy: false })
async function changePw() {
  pw.busy = true
  try { await api('POST', '/auth/password', { old: pw.old, new: pw.new }); pw.open = false; pw.old = pw.new = ''; await loadMe(); loadCounts() } finally { pw.busy = false }
}
</script>

<template>
  <Toast position="top-right" />
  <ConfirmDialog />
  <NuxtPage v-if="isLogin" />
  <div v-else-if="ready && me.admin" class="tg">
    <header class="tg-top">
      <NuxtLink to="/admin" class="tg-brand"><img :src="logo" alt=""><span>tugrik</span><small>control</small></NuxtLink>
      <nav class="tg-groups" aria-label="Разделы">
        <NuxtLink v-for="g in groups" :key="g.id" :to="g.to" :class="['tg-g', { on: current?.id === g.id }]">
          <i :class="['pi', g.icon]" /><span>{{ g.label }}</span><b v-if="g.count" class="tg-n">{{ g.count }}</b>
        </NuxtLink>
      </nav>
      <form class="tg-search" role="search" @submit.prevent="go">
        <i class="pi pi-search" /><input v-model="search" placeholder="Номер TG-… или клиент" aria-label="Быстрый поиск">
        <kbd>↵</kbd>
      </form>
      <div class="tg-me">
        <button type="button" class="tg-av" :aria-expanded="menu" @click="menu = !menu">{{ initials }}</button>
        <div v-if="menu" class="tg-menu" @click="menu = false">
          <div class="tg-menu-h"><b>{{ me.admin.name }}</b><span class="mono">{{ me.admin.login }} · {{ ROLE[me.admin.role] }}</span></div>
          <button v-if="!beta" type="button" @click="pw.open = true"><i class="pi pi-key" />Сменить пароль</button>
          <button type="button" @click="logout"><i class="pi pi-sign-out" />Выйти</button>
        </div>
      </div>
    </header>
    <div class="tg-sub">
      <nav class="tg-tabs" aria-label="Подразделы">
        <NuxtLink v-for="i in current?.items" :key="i.to" :to="i.to" :class="['tg-t', { on: isOn(i) }]">
          {{ i.label }}<span v-if="i.count" :class="['tg-c', { warn: i.warn }]">{{ i.count }}</span>
        </NuxtLink>
      </nav>
      <NuxtLink v-if="queueTotal && current?.id !== 'queue'" :to="groups.find(g => g.id === 'queue')?.to || '/admin/orders'" class="tg-q"><i />В очереди {{ queueTotal }}</NuxtLink>
    </div>
    <main class="adm-main">
      <div v-if="me.admin.must_change && !beta" class="banner"><i class="pi pi-exclamation-triangle warn" />
        <span>Вы вошли с временным паролем{{ me.admin.login === 'admin' ? ' admin/admin' : '' }}. Смените его, прежде чем работать дальше.</span>
        <Button size="small" label="Сменить пароль" @click="pw.open = true" />
      </div>
      <AdmCrumbs v-if="!me.admin.must_change || beta" />
      <NuxtPage v-if="!me.admin.must_change || beta" @changed="loadCounts" />
    </main>
  </div>
  <Dialog v-model:visible="pw.open" modal header="Смена пароля" :style="{ width: 'min(420px, 94vw)' }">
    <div class="grid">
      <div class="field"><label>Текущий пароль</label><Password v-model="pw.old" :feedback="false" toggle-mask fluid /></div>
      <div class="field"><label>Новый пароль — от 10 символов, буквы и цифры</label><Password v-model="pw.new" toggle-mask fluid /></div>
    </div>
    <template #footer><Button label="Отмена" severity="secondary" text @click="pw.open = false" /><Button label="Сохранить" :loading="pw.busy" @click="changePw" /></template>
  </Dialog>
</template>
