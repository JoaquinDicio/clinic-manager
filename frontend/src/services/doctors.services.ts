interface DoctorDTO {
  name: string;
  phone: string;
  email: string;
  specialty: string;
}

const doctorsService = {
  async getAll(): Promise<Response> {
    return await fetch("http://localhost:8080/doctors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  async create(doctor: DoctorDTO): Promise<Response> {
    return await fetch("http://localhost:8080/doctors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctor),
    });
  },
  async delete(doctorId: string): Promise<Response> {
    return await fetch(`http://localhost:8080/doctors/${doctorId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default doctorsService;
