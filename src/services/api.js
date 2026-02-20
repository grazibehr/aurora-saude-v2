const API_BASE_URL = "https://aurorasaude-backend.onrender.com";

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const config = {
      ...options,
    };
    const token = localStorage.getItem("aurora_token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      if (response.status === 204) {
        return { ok: true };
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        if (response.status >= 500) {
          throw new Error(
            "Servidor temporariamente indisponível. Tente novamente em alguns instantes."
          );
        }
        throw new Error("Resposta inesperada do servidor. Tente novamente.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro na requisição");
      }

      return data;
    } catch (error) {
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        throw new Error(
          "Não foi possível conectar ao servidor. Verifique sua conexão."
        );
      }
      throw error;
    }
  }

  // Autenticação
  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  }

  async cadastro(name, email, password) {
    return this.request("/auth/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
  }

  // DOENÇAS (CID)
  // Lista todas as doenças disponíveis
  async getDiseases() {
    return this.request("/diseases", { method: "GET" });
  }

  // Busca doenças por termo
  async searchDiseases(term) {
    return this.request(`/diseases/search?q=${encodeURIComponent(term)}`, {
      method: "GET",
    });
  }

  // FICHA MÉDICA

  // Obtém a ficha médica do usuário
  async getMedicalRecord() {
    return this.request("/medical-record", { method: "GET" });
  }

  // Atualiza a ficha médica completa
  async updateMedicalRecord(data) {
    return this.request("/medical-record", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  // Adiciona uma doença à ficha
  async addDiseaseToRecord(disease) {
    const payload = {
      disease_name: disease.name,
      cid_code: disease.code || null,
      notes: disease.notes || null,
    };

    if (disease.numericId && typeof disease.numericId === "number") {
      payload.disease_id = disease.numericId;
    }

    return this.request("/medical-record/diseases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  // Remove uma doença da ficha
  async removeDiseaseFromRecord(diseaseId) {
    return this.request(`/medical-record/diseases/${diseaseId}`, {
      method: "DELETE",
    });
  }

  // Adiciona um medicamento
  async addMedication(medication) {
    return this.request("/medical-record/medications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(medication),
    });
  }

  // Remove um medicamento
  async removeMedication(medicationId) {
    return this.request(`/medical-record/medications/${medicationId}`, {
      method: "DELETE",
    });
  }

  // Adiciona uma alergia
  async addAllergy(allergy) {
    return this.request("/medical-record/allergies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        allergen: allergy.name,
        severity: allergy.severity || "moderate",
        notes: allergy.notes || null,
      }),
    });
  }

  // Remove uma alergia
  async removeAllergy(allergyId) {
    return this.request(`/medical-record/allergies/${allergyId}`, {
      method: "DELETE",
    });
  }

  // Atualiza informações gerais
  async updateMedicalInfo(info) {
    return this.request("/medical-record", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blood_type: info.bloodType || info.blood_type,
        emergency_contact_name:
          info.emergencyContact?.name || info.emergency_contact_name,
        emergency_contact_phone:
          info.emergencyContact?.phone || info.emergency_contact_phone,
        observations: info.notes || info.observations,
      }),
    });
  }

  // SINTOMAS

  // Lista sintomas do usuario
  async getSymptoms(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/usuario/sintoma/lista${query ? "?" + query : ""}`, {
      method: "GET",
    });
  }

  // Adiciona um sintoma
  async addSymptom(symptom) {
    return this.request("/usuario/sintoma/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(symptom),
    });
  }

  // Remove um sintoma
  async deleteSymptom(symptomId) {
    return this.request(`/usuario/sintoma/${symptomId}`, {
      method: "DELETE",
    });
  }

  // Lista catalogo de sintomas disponiveis
  async getSymptomsCatalog() {
    return this.request("/sintomas/lista", { method: "GET" });
  }

  // CHECK-INS DE BEM-ESTAR

  // Lista check-ins do usuário
  async getCheckins(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/checkins${query ? "?" + query : ""}`, {
      method: "GET",
    });
  }

  // Adiciona check-in diário
  async addCheckin(checkin) {
    return this.request("/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkin),
    });
  }

  // Obtém check-in do dia
  async getTodayCheckin() {
    return this.request("/checkins/today", { method: "GET" });
  }

  // ANÁLISES E INSIGHTS

  // Obtém análise de tendências
  async getTrendAnalysis() {
    return this.request("/analysis/trends", { method: "GET" });
  }

  // Obtém dicas personalizadas
  async getHealthTips() {
    return this.request("/analysis/tips", { method: "GET" });
  }

  // Obtém score de saúde
  async getHealthScore() {
    return this.request("/analysis/score", { method: "GET" });
  }

  // PERFIL USUÁRIO

  // Atualiza perfil do usuário
  async updateProfile(data) {
    return this.request("/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiService();
export default api;
