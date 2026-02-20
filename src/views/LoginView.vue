<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Heart, User, Mail, Lock, ArrowRight, Check } from "lucide-vue-next";
import { useAuth } from "../composables/useAuth";
import { BaseButton, BaseInput, BaseAlert } from "../components/ui";
import { validarSenhaForte } from "@/utils/passwordValidator";
import { Eye, EyeOff } from "lucide-vue-next";

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
const router = useRouter();
const { login, cadastro } = useAuth();

const isLoginMode = ref(true);
const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const passwordRules = computed(() => ({
  length: password.value.length >= 8,
  lower: /[a-z]/.test(password.value),
  upper: /[A-Z]/.test(password.value),
  number: /\d/.test(password.value),
  symbol: /[^\w\s]/.test(password.value),
}));
const isStrongPassword = computed(
  () =>
    passwordRules.value.length &&
    passwordRules.value.lower &&
    passwordRules.value.upper &&
    passwordRules.value.number &&
    passwordRules.value.symbol
);
const isFormValid = computed(() => {
  const emailValid = email.value.includes("@");

  if (isLoginMode.value) {
    return emailValid && password.value.length >= 1;
  }

  const senhaErro = validarSenhaForte(password.value);
  return name.value.trim().length >= 2 && emailValid && !senhaErro;
});
const handleSubmit = async () => {
  error.value = "";

  if (!isFormValid.value) {
    error.value = "Preencha os campos corretamente.";
    return;
  }

  if (!isLoginMode.value) {
    const senhaErro = validarSenhaForte(password.value);
    if (senhaErro) {
      error.value = senhaErro;
      return;
    }
  }

  isLoading.value = true;

  try {
    if (isLoginMode.value) {
      await login(email.value, password.value);
    } else {
      await cadastro(name.value, email.value, password.value);
    }

    await router.push("/");
  } catch (err) {
    error.value =
      err?.response?.data?.message ||
      err?.message ||
      "Erro ao autenticar. Tente novamente.";
  } finally {
    isLoading.value = false;
  }
};

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  error.value = "";
};

const features = [
  "Registro rápido de sintomas",
  "Histórico completo de saúde",
  "Insights personalizados",
  "Dados seguros e privados",
];
</script>

<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Left side - Branding -->
    <div
      class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 p-16 flex-col justify-between"
    >
      <!-- Logo -->
      <div class="flex items-center gap-4">
        <div
          class="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center"
        >
          <Heart class="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">
            Aurora Saúde
          </h1>
          <p class="text-teal-100 text-sm">Seu bem-estar em primeiro lugar</p>
        </div>
      </div>

      <!-- Main content -->
      <div class="max-w-lg">
        <h2
          class="text-5xl font-bold text-white mb-6 leading-[1.1] tracking-tight"
        >
          Cuide da sua saúde de forma simples
        </h2>
        <p class="text-xl text-white/80 leading-relaxed mb-12">
          Acompanhe seus sintomas, identifique padrões e tome decisões mais
          conscientes sobre seu bem-estar.
        </p>

        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="feature in features"
            :key="feature"
            class="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3"
          >
            <div
              class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"
            >
              <Check class="w-4 h-4 text-white" />
            </div>
            <span class="text-white text-sm font-medium">{{ feature }}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-teal-100 text-sm">Projeto de Pós-Graduação — PUC-Rio</p>
    </div>

    <!-- Right side - Login Form -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Mobile logo -->
        <div class="lg:hidden flex flex-col items-center mb-12">
          <div
            class="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center mb-4"
          >
            <Heart class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Aurora Saúde</h1>
          <p class="text-gray-500 text-sm">Seu bem-estar em primeiro lugar</p>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            {{ isLoginMode ? "Bem-vindo de volta" : "Criar conta" }}
          </h2>
          <p class="text-gray-500 text-lg">
            {{
              isLoginMode
                ? "Entre para continuar cuidando da sua saúde"
                : "Comece sua jornada de bem-estar"
            }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <BaseAlert
            v-if="error"
            variant="error"
            dismissible
            @dismiss="error = ''"
          >
            {{ error }}
          </BaseAlert>

          <BaseInput
            v-if="!isLoginMode"
            v-model="name"
            label="Nome"
            placeholder="Seu nome"
            required
            :minlength="2"
            :maxlength="100"
            autocomplete="name"
          >
            <template #icon-left>
              <User class="w-5 h-5" />
            </template>
          </BaseInput>

          <BaseInput
            v-model="email"
            type="email"
            label="E-mail"
            placeholder="seu@email.com"
            required
            autocomplete="email"
          >
            <template #icon-left>
              <Mail class="w-5 h-5" />
            </template>
          </BaseInput>

          <BaseInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Sua senha"
            label="Senha"
            required
            :minlength="8"
            :maxlength="128"
            :autocomplete="isLoginMode ? 'current-password' : 'new-password'"
          >
            <template #icon-left>
              <Lock class="w-5 h-5" />
            </template>

            <template #icon-right>
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="focus:outline-none text-gray-400 hover:text-gray-600"
                aria-label="Mostrar ou ocultar senha"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </template>
          </BaseInput>

          <div v-if="!isLoginMode" class="mt-2">
            <p
              v-if="isStrongPassword"
              class="text-sm font-medium text-green-600"
            >
              ✔ Senha forte
            </p>

            <ul v-else class="text-sm space-y-1">
              <li class="flex items-center gap-2">
                <span
                  :class="
                    passwordRules.length ? 'text-green-600' : 'text-gray-400'
                  "
                >
                  {{ passwordRules.length ? "✔" : "•" }}
                </span>
                Pelo menos 8 caracteres
              </li>

              <li class="flex items-center gap-2">
                <span
                  :class="
                    passwordRules.lower && passwordRules.upper
                      ? 'text-green-600'
                      : 'text-gray-400'
                  "
                >
                  {{ passwordRules.lower && passwordRules.upper ? "✔" : "•" }}
                </span>
                Letras maiúsculas e minúsculas
              </li>

              <li class="flex items-center gap-2">
                <span
                  :class="
                    passwordRules.number ? 'text-green-600' : 'text-gray-400'
                  "
                >
                  {{ passwordRules.number ? "✔" : "•" }}
                </span>
                Pelo menos um número
              </li>

              <li class="flex items-center gap-2">
                <span
                  :class="
                    passwordRules.symbol ? 'text-green-600' : 'text-gray-400'
                  "
                >
                  {{ passwordRules.symbol ? "✔" : "•" }}
                </span>
                Pelo menos um símbolo
              </li>
            </ul>
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            full-width
            :disabled="!isFormValid"
            :loading="isLoading"
          >
            {{ isLoginMode ? "Entrar" : "Criar conta" }}
            <template #icon-right>
              <ArrowRight class="w-5 h-5" />
            </template>
          </BaseButton>
        </form>

        <div class="mt-8 text-center">
          <span class="text-gray-500">
            {{ isLoginMode ? "Não tem uma conta?" : "Já tem uma conta?" }}
          </span>
          <button
            type="button"
            class="ml-2 text-teal-600 hover:text-teal-700 font-semibold"
            @click="toggleMode"
          >
            {{ isLoginMode ? "Criar conta" : "Entrar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
