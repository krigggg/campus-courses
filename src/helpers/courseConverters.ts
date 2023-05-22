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

export const MarkConvertions = {
  Passed: "успешно пройдена",
  Failed: "зафейлена",
  NotDefined: "отметки нет"
}

export const MarkColor = {
  Passed: "green",
  Failed: "red",
  NotDefined: "gray"
}

export const StudentStatusConvertions = {
  InQueue: "в очереди",
  Accepted: "принят в группу",
  Declined: "отклонен"
}

export const StudentStatusColor = {
  InQueue: "text-blue-400",
  Accepted: "text-green-400",
  Declined: "text-red-400"
}

export const convertSemester = (current: string) => current === "Autumn" ? "Осенний" : "Весенний";
