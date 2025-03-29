import { Box, Heading, VStack, Text, useDisclosure, Button, Collapse } from '@chakra-ui/react';
import { RegisteredTasksTable } from '../../../components/tables/RegisteredTasksTable';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import { RegisteredTask } from '../../../types/task';

interface LogsByDaysProps {
  logs: RegisteredTask[];
}

export const LogsByDays = ({ logs }: LogsByDaysProps) => {
  // Групуємо логи по днях
  const logsByDays = logs.reduce((acc, log) => {
    const date = format(parseISO(log.registeredAt), 'yyyy-MM-dd', { locale: uk });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as Record<string, RegisteredTask[]>);

  // Сортуємо дні за спаданням
  const sortedDays = Object.keys(logsByDays).sort((a, b) => b.localeCompare(a));

  return (
    <VStack spacing={6} align="stretch">
      {sortedDays.map((date) => (
        <DayLogs key={date} date={date} logs={logsByDays[date]} />
      ))}
    </VStack>
  );
};

interface DayLogsProps {
  date: string;
  logs: RegisteredTask[];
}

const DayLogs = ({ date, logs }: DayLogsProps) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: false });
  const formattedDate = format(parseISO(date), 'dd MMMM yyyy', { locale: uk });

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Button
        variant="ghost"
        width="100%"
        justifyContent="space-between"
        onClick={onToggle}
      >
        <Text fontWeight="bold">{formattedDate}</Text>
        <Text color="gray.500">{logs.length} реєстрацій</Text>
      </Button>
      <Collapse in={isOpen}>
        <Box mt={4}>
          <RegisteredTasksTable
            tasks={logs}
            type="PRODUCT"
            hiddenColumns={['actions']}
          />
        </Box>
      </Collapse>
    </Box>
  );
}; 