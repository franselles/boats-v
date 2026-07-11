<script setup lang="ts">
import { ref, computed } from "vue";

const form = ref({
  name: "",
  email: "",
  phone: "",
  date: "",
  hour: "",
  sectorId: "",
});

const loading = ref(false);
const statusMessage = ref({ text: "", type: "" });

const { data: sectores } = await useFetch("/api/sectors");

const horasDisponibles = ["12", "13", "14", "15", "16", "17"];

const sectoresLevante = computed(() => {
  if (!sectores.value) return [];
  return sectores.value.filter((s: any) =>
    s.location.toLowerCase().includes("levante"),
  );
});

const sectoresPoniente = computed(() => {
  if (!sectores.value) return [];
  return sectores.value.filter((s: any) =>
    s.location.toLowerCase().includes("poniente"),
  );
});

const listaSectores = computed(() => {
  if (!sectores.value) return [];
  return sectores.value.map((s: any) => ({
    label: `${s.name} (${s.price}€/h)`,
    value: s.id,
  }));
});

// Convertir horas a formato de opciones para el select
const listaHoras = horasDisponibles.map((h) => ({
  label: `${h}:00 h`,
  value: h,
}));

const handleBooking = async () => {
  loading.value = true;
  statusMessage.value = { text: "", type: "" };

  try {
    await $fetch("/api/booking", {
      method: "POST",
      body: {
        ...form.value,
        hour: parseInt(form.value.hour),
      },
    });

    statusMessage.value = {
      text: "¡Reserva realizada con éxito! Nos vemos en la playa.",
      type: "success",
    };
    form.value = {
      name: "",
      email: "",
      phone: "",
      date: "",
      hour: "",
      sectorId: "",
    };
  } catch (error: any) {
    statusMessage.value = {
      text:
        error.data?.statusMessage || "Hubo un error al procesar tu reserva.",
      type: "error",
    };
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-amber-500 selection:text-slate-900"
  >
    <header
      class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 py-3 px-4 shadow-sm"
    >
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <img
          src="/logo.png"
          alt="R.A. Benidorm S.L."
          class="h-12 w-auto object-contain"
        />

        <nav
          class="flex gap-4 text-xs font-bold text-purple-950 uppercase tracking-wider"
        >
          <a href="#precios" class="hover:text-amber-500 transition mt-1.5"
            >Precios</a
          >
          <a href="#productos" class="hover:text-amber-500 transition mt-1.5"
            >Modelos</a
          >
          <a href="#normas" class="hover:text-amber-500 transition mt-1.5"
            >Normas</a
          >
          <a
            href="#reservar"
            class="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-full shadow-sm hover:bg-amber-600 transition"
            >Reservar</a
          >
        </nav>
      </div>
    </header>

    <section
      class="relative h-[55vh] flex items-center justify-center bg-cover bg-center"
      style="background-image: url(/benidorm-beach.jpeg)"
    >
      <div
        class="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/40 to-transparent"
      ></div>
      <div class="relative text-center px-4 text-white max-w-xl">
        <h1 class="text-3xl font-extrabold tracking-tight drop-shadow-md">
          Alquiler de Hidropedales en Benidorm
        </h1>
      </div>
    </section>

    <main class="max-w-xl mx-auto px-4 py-8 space-y-12">
      <section id="precios" class="scroll-mt-20 space-y-4">
        <h2
          class="text-2xl font-bold text-purple-950 border-b-2 border-amber-500 pb-1"
        >
          Precios y Ubicaciones
        </h2>
        <p class="text-sm text-slate-600">
          Elige el sector que mejor te venga para reservar tu hidropedal.
        </p>

        <!-- Bloque Playa de Levante -->
        <div
          class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4"
        >
          <!-- Cabecera -->
          <div
            class="flex justify-between items-center border-b border-slate-100 pb-2"
          >
            <h3 class="font-bold text-lg text-amber-600">Playa de Levante</h3>
            <span
              class="bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-full text-xs"
            >
              {{ sectoresLevante[0]?.price || 30 }}€ / hora
            </span>
          </div>

          <!-- Mapa a gran tamaño -->
          <div
            class="bg-slate-50 p-2 rounded-xl border border-slate-100 overflow-hidden"
          >
            <img
              src="/sectores-playa-levante.png"
              alt="Plano de Sectores Playa de Levante"
              class="w-full h-auto max-h-[220px] object-contain mx-auto"
            />
          </div>

          <!-- Listado inferior -->
          <div class="space-y-1.5">
            <p
              class="text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
              Sectores de alquiler disponibles:
            </p>
            <ul
              class="text-sm space-y-1 list-disc list-inside text-slate-700 font-medium grid grid-cols-2 gap-x-2"
            >
              <!-- El grid cols-2 hace que si hay muchos sectores se organicen en dos columnas limpias debajo del mapa -->
              <li v-for="s in sectoresLevante" :key="s.id">{{ s.name }}</li>
            </ul>
          </div>
        </div>

        <!-- Bloque Playa de Poniente -->
        <div
          class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4"
        >
          <!-- Cabecera -->
          <div
            class="flex justify-between items-center border-b border-slate-100 pb-2"
          >
            <h3 class="font-bold text-lg text-purple-900">Playa de Poniente</h3>
            <span
              class="bg-purple-100 text-purple-950 font-extrabold px-3 py-1 rounded-full text-xs"
            >
              {{ sectoresPoniente[0]?.price || 25 }}€ / hora
            </span>
          </div>

          <!-- Mapa a gran tamaño -->
          <div
            class="bg-slate-50 p-2 rounded-xl border border-slate-100 overflow-hidden"
          >
            <img
              src="/sectores-playa-poniente.png"
              alt="Plano de Sectores Playa de Poniente"
              class="w-full h-auto max-h-[220px] object-contain mx-auto"
            />
          </div>

          <!-- Listado inferior -->
          <div class="space-y-1.5">
            <p
              class="text-xs font-bold text-slate-500 uppercase tracking-wider"
            >
              Sectores de alquiler disponibles:
            </p>
            <ul
              class="text-sm space-y-1 list-disc list-inside text-slate-700 font-medium grid grid-cols-2 gap-x-2"
            >
              <li v-for="s in sectoresPoniente" :key="s.id">{{ s.name }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="productos" class="scroll-mt-20 space-y-6">
        <h2
          class="text-2xl font-bold text-purple-950 border-b-2 border-amber-500 pb-1"
        >
          Nuestros Modelos
        </h2>
        <p class="text-sm text-slate-600">
          Disponemos de equipamiento de primera calidad para que disfrutes del
          mar:
        </p>

        <div class="space-y-6">
          <div
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100"
          >
            <img
              src="/hidropedal.jpg"
              alt="Hidropedal con tobogán"
              class="w-full h-48 object-cover"
            />
            <div class="p-5 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-base text-slate-900">
                  Hidropedales con Tobogán
                </h3>
                <span
                  class="bg-green-100 text-green-800 text-[11px] font-bold px-2 py-0.5 rounded"
                  >Reserva Web Activa</span
                >
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Nuestro modelo estrella. Cuenta con un divertido tobogán
                integrado y escalerilla de acceso trasera. Ideal para navegar en
                grupo y refrescarse de forma segura.
              </p>
              <a
                href="#reservar"
                class="block text-center bg-purple-950 hover:bg-purple-900 text-white text-xs font-bold py-2 rounded-xl transition"
              >
                Ir al formulario de reserva
              </a>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 opacity-85"
          >
            <img
              src="/kayak.jpg"
              alt="Alquiler de Kayaks"
              class="w-full h-48 object-cover"
            />
            <div class="p-5 space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-base text-slate-900">
                  Kayaks Recreativos
                </h3>
                <span
                  class="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded"
                  >Solo en Playa</span
                >
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Disponibles directamente en taquilla. Embarcaciones estables y
                ergonómicas. *No admiten reserva web previa.
              </p>
            </div>
          </div>

          <div
            class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 opacity-85"
          >
            <img
              src="/padel.jpg"
              alt="Tablas de Paddle Surf"
              class="w-full h-48 object-cover"
            />
            <div class="p-5 space-y-2">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-base text-slate-900">
                  Stand Up Paddle Surf
                </h3>
                <span
                  class="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded"
                  >Solo en Playa</span
                >
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                Tablas estables perfectas para deslizarte sobre el agua de
                Benidorm. *No admiten reserva web previa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="normas" class="scroll-mt-20 space-y-4">
        <h2
          class="text-2xl font-bold text-purple-950 border-b-2 border-amber-500 pb-1"
        >
          Normas de Uso y Seguridad
        </h2>
        <p class="text-sm text-slate-600">
          Es totalmente obligatorio respetar el esquema oficial de navegación
          para proteger a bañistas y usuarios:
        </p>

        <div class="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <img
            src="/esquema_uso.png"
            alt="Esquema de navegación"
            class="w-full h-auto rounded-xl max-h-[300px] object-contain mx-auto"
          />
        </div>

        <div class="space-y-2.5 text-xs text-slate-700">
          <div
            class="bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 shadow-xs"
          >
            <span
              class="bg-amber-500 text-slate-950 p-1 rounded-full font-bold text-[10px]"
              >✓</span
            >
            <p>
              Mantenerse dentro de la zona asignada y siempre estar a la vista
              del operario.
            </p>
          </div>
          <div
            class="bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 shadow-xs"
          >
            <span
              class="bg-amber-500 text-slate-950 p-1 rounded-full font-bold text-[10px]"
              >✓</span
            >
            <p>Hacer estricto caso de las indicaciones del operario.</p>
          </div>
          <div
            class="bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 shadow-xs"
          >
            <span
              class="bg-amber-500 text-slate-950 p-1 rounded-full font-bold text-[10px]"
              >✓</span
            >
            <p>
              Los menores de 18 años deberán ir acompañados de algún adulto.
            </p>
          </div>
          <div
            class="bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 shadow-xs"
          >
            <span
              class="bg-amber-500 text-slate-950 p-1 rounded-full font-bold text-[10px]"
              >✓</span
            >
            <p>
              <strong>Capacidad:</strong> Máximo de 4 personas a bordo del
              hidropedal simultáneamente.
            </p>
          </div>
          <div
            class="bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 shadow-xs"
          >
            <span
              class="bg-amber-500 text-slate-950 p-1 rounded-full font-bold text-[10px]"
              >✓</span
            >
            <p>
              <strong>Canal de Acceso:</strong> Entrada y salida exclusiva por
              el carril central delimitado por boyas amarillas.
            </p>
          </div>
          <div
            class="bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 shadow-xs"
          >
            <span
              class="bg-amber-500 text-slate-950 p-1 rounded-full font-bold text-[10px]"
              >✓</span
            >
            <p>
              <strong>Zonas Prohibidas (NO):</strong> Prohibido navegar a menos
              de 25 metros de la orilla fuera del canal.
            </p>
          </div>
          <div
            class="bg-white p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 shadow-xs"
          >
            <span
              class="bg-amber-500 text-slate-950 p-1 rounded-full font-bold text-[10px]"
              >✓</span
            >
            <p>
              En el cumplimiento acordado en el "pliego de condiciones para la
              explotación comercial de embarcaciones, motos náuticas y
              artefactos flotantes en las playas" (dictado por capitanía
              marítima de alicante, 25/02/04) se solicitará a toda persona que
              quiera alquilar un hidropedal, presente su documentación con el
              fín de ser registrado por los encargados de esta empresa.
            </p>
          </div>
        </div>
      </section>

      <section
        id="reservar"
        class="scroll-mt-20 bg-white p-6 rounded-3xl shadow-md border border-slate-100 space-y-6"
      >
        <div class="text-center">
          <h2 class="text-2xl font-bold text-purple-950">
            Solicita tu Alquiler
          </h2>
          <p class="text-xs text-slate-500 mt-1">
            Elige tu sector y hora para reservar tu hidropedal.
          </p>
        </div>

        <form @submit.prevent="handleBooking" class="space-y-4">
          <UFormField label="Nombre del Cliente">
            <UInput
              v-model="form.name"
              placeholder="Ej. Fran"
              size="lg"
              required
            />
          </UFormField>

          <UFormField label="Número de Teléfono">
            <UInput
              v-model="form.phone"
              type="tel"
              placeholder="Ej. 600123456"
              size="lg"
              required
            />
          </UFormField>

          <UFormField label="Correo Electrónico">
            <UInput
              v-model="form.email"
              type="email"
              placeholder="ejemplo@correo.com"
              size="lg"
              required
            />
          </UFormField>

          <UFormField label="Día de la reserva">
            <UInput v-model="form.date" type="date" size="lg" required />
          </UFormField>

          <UFormField label="Sector / Punto de Reserva">
            <USelect
              v-model="form.sectorId"
              :items="listaSectores"
              placeholder="Selecciona el sector..."
              size="lg"
              required
            />
          </UFormField>

          <UFormField label="Hora de la reserva">
            <USelect
              v-model="form.hour"
              :items="listaHoras"
              placeholder="Selecciona la hora..."
              size="lg"
              required
            />
          </UFormField>

          <div
            v-if="statusMessage.text"
            :class="[
              'p-3 rounded-xl text-xs text-center font-bold tracking-wide',
              statusMessage.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800',
            ]"
          >
            {{ statusMessage.text }}
          </div>

          <UButton
            type="submit"
            block
            size="xl"
            :loading="loading"
            class="font-extrabold rounded-xl mt-2 text-white bg-purple-950 hover:bg-purple-900 shadow-sm"
          >
            Confirmar Reserva de Hidropedal
          </UButton>
        </form>
      </section>
    </main>

    <footer
      class="bg-slate-950 text-slate-400 text-center text-[11px] py-6 mt-12 border-t border-slate-900"
    >
      <p>&copy; 2026 R.A. BENIDORM S.L. Todos los derechos reservados. 0.0.6</p>
      <p class="mt-0.5 text-slate-600 tracking-wider font-medium uppercase">
        Limpieza, Mantenimiento y Alquileres en Playa
      </p>
    </footer>
  </div>
</template>
