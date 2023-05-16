export const statusColors = {
    Created: "text-gray-600",
    OpenForAssigning: "text-green-500",
    Started: "text-blue-400",
    Finished: "text-red-500",
  };

export const statusConvertions = {
    Created: "Создан",
    OpenForAssigning: "Открыт для записи",
    Started: "В процессе обучения",
    Finished: "Закрыт",
  };

export const convertSemester = (current: string) => current === "Autumn" ? "Осенний" : "Весенний";
