<script setup lang="ts">
import { ref, computed } from 'vue'

// Estado del formulario de reserva adaptado al nuevo esquema de Prisma
const form = ref({
  name: '',
  email: '',
  phone: '',
  date: '',
  hour: '',
  sectorId: ''
})

const loading = ref(false)
const statusMessage = ref({ text: '', type: '' })

// 🚀 ÚNICA petición al endpoint. Trae los sectores en crudo de la base de datos
const { data: sectores } = await useFetch('/api/sectors')

// Horas en punto (de 10:00 a 19:00)
const horasDisponibles = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19']

// Filtrar sectores dinámicamente según la columna 'location' para las tarjetas informativas
const sectoresLevante = computed(() => {
  if (!sectores.value) return []
  return sectores.value.filter((s: any) => s.location.toLowerCase().includes('levante'))
})

const sectoresPoniente = computed(() => {
  if (!sectores.value) return []
  return sectores.value.filter((s: any) => s.location.toLowerCase().includes('poniente'))
})

// Mapear los sectores reactivos al formato { label, value } requerido por Nuxt UI v3
const listaSectores = computed(() => {
  if (!sectores.value) return []
  return sectores.value.map((s: any) => ({
    label: `${s.name} (${s.price}€/h)`,
    value: s.id
  }))
})

// Convertir horas a formato de opciones para el select
const listaHoras = horasDisponibles.map(h => ({
  label: `${h}:00 h`,
  value: parseInt(h)
}))

// Envío del formulario hacia el backend
const handleBooking = async () => {
  loading.value = true
  statusMessage.value = { text: '', type: '' }

  try {
    await $fetch('/api/booking', {
      method: 'POST',
      body: form.value
    })

    statusMessage.value = { text: '¡Reserva realizada con éxito! Nos vemos en la playa.', type: 'success' }
    form.value = { name: '', email: '', phone: '', date: '', hour: '', sectorId: '' }
  } catch (error: any) {
    statusMessage.value = {
      text: error.data?.statusMessage || 'Hubo un error al procesar tu reserva.',
      type: 'error'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-amber-500 selection:text-slate-900">

    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 py-3 px-4 shadow-sm">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <img src="/logo.png" alt="R.A. Benidorm S.L." class="h-12 w-auto object-contain" />

        <nav class="flex gap-4 text-xs font-bold text-purple-950 uppercase tracking-wider">
          <a href="#precios" class="hover:text-amber-500 transition mt-1.5">Precios</a>
          <a href="#productos" class="hover:text-amber-500 transition mt-1.5">Flota</a>
          <a href="#normas" class="hover:text-amber-500 transition mt-1.5">Normas</a>
          <a href="#reservar" class="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-full shadow-sm hover:bg-amber-600 transition">Reservar</a>
        </nav>
      </div>
    </header>

    <section class="relative h-[55vh] flex items-center justify-center bg-cover bg-center" style="background-image: url('/benidorm-beach.jpeg');">
      <div class="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/40 to-transparent"></div>
      <div class="relative text-center px-4 text-white max-w-xl">
        <h1 class="text-3xl font-extrabold tracking-tight drop-shadow-md">
          Alquiler de Hidropedales en Benidorm
        </h1>
      </div>
    </section>

    <main class="max-w-xl mx-auto px-4 py-8 space-y-12">

      <section id="precios" class="scroll-mt-20 space-y-4">
        <h2 class="text-2xl font-bold text-purple-950 border-b-2 border-amber-500 pb-1">Precios y Ubicaciones</h2>
        <p class="text-sm text-slate-600">
          Elige el sector que mejor te venga para recoger tu hidropedal. Los precios se obtienen directamente del sistema:
        </p>

        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-lg text-amber-600">Playa de Levante</h3>
            <span class="bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-full text-xs">
              {{ sectoresLevante[0]?.price || 30 }}€ / hora
            </span>
          </div>
          <p class="text-xs text-slate-500">Sectores de recogida disponibles:</p>
          <ul class="text-sm space-y-1 list-disc list-inside text-slate-700 font-medium">
            <li v-for="s in sectoresLevante" :key="s.id">{{ s.name }}</li>
          </ul>
        </div>

        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-lg text-purple-900">Playa de Poniente</h3>
            <span class="bg-purple-100 text-purple-950 font-extrabold px-3 py-1 rounded-full text-xs">
              {{ sectoresPoniente[0]?.price || 25 }}€ / hora
            </span>
          </div>
          <p class="text-xs text-slate-500">Sectores de recogida disponibles:</p>
          <ul class="text-sm space-y-1 list-disc list-inside text-slate-700 font-medium">
            <li v-for="s in sectoresPoniente" :key="s.id">{{ s.name }}</li>
          </ul>
        </div>
      </section>

      <section id="productos" class="scroll-mt-20 space-y-6">
        <h2 class="text-2xl font-bold text-purple-950 border-b-2 border-amber-500 pb-1">Nuestra Flota</h2>
        <p class="text-sm text-slate-600">Disponemos de equipamiento de primera calidad para que disfrutes del mar:</p>

        <div class="space-y-6">
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <img src="/hidropedal.jpg" alt="Hidropedal con tobogán" class="w-full h-48 object-cover" />
            <div class="p-5 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-base text-slate-900">Hidropedales con Tobogán</h3>
                <span class="bg-green-100 text-green-800 text-[11px] font-bold px-2 py-0.5 rounded">Reserva Web Activa</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Nuestro modelo estrella. Cuenta con un divertido tobogán integrado y escalerilla de acceso trasera. Ideal para navegar en grupo y refrescarse de forma segura.
              </p>
              <a href="#reservar" class="block text-center bg-purple-950 hover:bg-purple-900 text-white text-xs font-bold py-2 rounded-xl transition">
                Ir al formulario de reserva
              </a>
            </div>
          </div>

          <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 opacity-85">
            <img src="/kayak.jpg" alt="Alquiler de Kayaks" class="w-full h-48 object-cover" />
            <div class="p-5 space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-base text-slate-900">Kayaks Recreativos</h3>
                <span class="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded">Solo en Playa</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Disponibles directamente en taquilla. Embarcaciones estables y ergonómicas. *No admiten reserva web previa.
              </p>
            </div>
          </div>

          <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 opacity-85">
            <img src="/padel.jpg" alt="Tablas de Paddle Surf" class="w-full h-48 object-cover" />
            <div class="p-5 space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-base text-slate-900">Stand Up Paddle Surf</h3>
                <span class="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded">Solo en Playa</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Tablas estables perfectas para deslizarte sobre el agua de Benidorm. *No admiten reserva web previa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="normas" class="scroll-mt-20 space-y-4">
        <h2 class="text-2xl font-bold text-purple-950 border-b-2 border-amber-500 pb-1">Normas de Uso y Seguridad</h2>
        <p class="text-sm text-slate-600">Es totalmente obligatorio respetar el esquema oficial de navegación para proteger a bañistas y usuarios:</p>

        <div class="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <img src="/esquema_uso.png" alt="Esquema de navegación" class="w-full h-auto rounded-xl max-h-[300px] object-contain mx-auto" />
        </div>

        <div class="space-y-2.5 text-xs text-slate-700">
          <div class="bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 shadow-xs">
            <span class="bg-amber-500 text-slate-950 p-1 rounded-full font-bold text-[10px]">✓</span>
            <p><strong>Capacidad:</strong> Máximo de 4 personas a bordo del hidropedal simultáneamente.</p>
          </div>
          <div class="bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 shadow-xs">
            <span class="bg-amber-500 text-slate-950 p-1 rounded-full font-bold text-[10px]">✓</span>
            <p><strong>Canal de Acceso:</strong> Entrada y salida exclusiva por el carril central delimitado por boyas amarillas.</p>
          </div>
          <div class="bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 shadow-xs">
            <span class="bg-amber-500 text-slate-950 p-1 rounded-full font-bold text-[10px]">✓</span>
            <p><strong>Zonas Prohibidas (NO):</strong> Prohibido navegar a menos de 25 metros de la orilla fuera del canal.</p>
          </div>
        </div>
      </section>

      <section id="reservar" class="scroll-mt-20 bg-white p-6 rounded-3xl shadow-md border border-slate-100 space-y-6">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-purple-950">Solicita tu Reserva</h2>
          <p class="text-xs text-slate-500 mt-1">Elige tu sector y hora para fijar tu hidropedal.</p>
        </div>

        <form @submit.prevent="handleBooking" class="space-y-4">

          <UFormField label="Nombre del Cliente">
            <UInput v-model="form.name" placeholder="Ej. Fran" size="lg" required />
          </UFormField>

          <UFormField label="Número de Teléfono">
            <UInput v-model="form.phone" type="tel" placeholder="Ej. 600123456" size="lg" required />
          </UFormField>

          <UFormField label="Correo Electrónico">
            <UInput v-model="form.email" type="email" placeholder="ejemplo@correo.com" size="lg" required />
          </UFormField>

          <UFormField label="Día de la Reserva">
            <UInput v-model="form.date" type="date" size="lg" required />
          </UFormField>

          <UFormField label="Sector / Punto de Recogida">
            <USelect
              v-model="form.sectorId"
              :items="listaSectores"
              placeholder="Selecciona el sector..."
              size="lg"
              required
            />
          </UFormField>

          <UFormField label="Hora del Alquiler">
            <USelect
              v-model="form.hour"
              :items="listaHoras"
              placeholder="Selecciona la hora..."
              size="lg"
              required
            />
          </UFormField>

          <div v-if="statusMessage.text" :class="['p-3 rounded-xl text-xs text-center font-bold tracking-wide', statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
            {{ statusMessage.text }}
          </div>

          <UButton type="submit" block size="xl" :loading="loading" class="font-extrabold rounded-xl mt-2 text-white bg-purple-950 hover:bg-purple-900 shadow-sm">
            Confirmar Reserva de Hidropedal
          </UButton>

        </form>
      </section>

    </main>

    <footer class="bg-slate-950 text-slate-400 text-center text-[11px] py-6 mt-12 border-t border-slate-900">
      <p>&copy; 2026 R.A. BENIDORM S.L. Todos los derechos reservados.</p>
      <p class="mt-0.5 text-slate-600 tracking-wider font-medium uppercase">Mantenimiento y Alquileres en Playa</p>
    </footer>

  </div>
</template>
