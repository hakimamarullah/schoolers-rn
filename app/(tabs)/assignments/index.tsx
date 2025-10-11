import AssignmentCardSkeleton from "@/components/AssignmentCardSkeleton";
import AssignmentList, { Assignment } from "@/components/AssignmentList";
import { PageLayout } from "@/components/PageLayout";
import assignmentService from "@/services/assignment.service";
import { AssignmentResponse } from "@/types/assignments.type";
import { MaterialIcons } from "@expo/vector-icons";
import { RelativePathString, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AssignmentsScreen() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const { t } = useTranslation();

  
  const loadingRef = useRef(false);
  const PAGE_SIZE = 20;

  const transformToAssignment = (item: AssignmentResponse): Assignment => {
    const dateParts = item?.dueDate?.split(" ");
    return {
      id: item.id,
      date: dateParts?.[0],
      month: dateParts?.[1],
      year: dateParts?.[2],
      timeLeft: item.remainingTimeBadgeText,
      title: item.subjectName,
      description: item.title,
      isUrgent: item.badgeColor === "urgent" || item.badgeColor === "overdue",
    };
  };

  const fetchAssignments = async (pageNum: number, isRefresh = false) => {
    if (loadingRef.current) return;
    if (!isRefresh && !hasMore) return;

    loadingRef.current = true;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await assignmentService.getAssignments(pageNum, PAGE_SIZE);
      if (response) {
        if (isRefresh) {
          setAssignments(response.content || []);
          setPage(0);
        } else {
          setAssignments((prev) => [...prev, ...(response.content || [])]);
        }
        setHasMore(pageNum + 1 < response.totalPages);
      }
    } catch (error: any) {
      console.log({err: error.m})
      
    } finally {
      setLoading(false);
      setRefreshing(false);
      setInitialLoad(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    fetchAssignments(0, true);
  }, []);

  const onRefresh = useCallback(() => {
    setHasMore(true);
    setPage(0);
    fetchAssignments(0, true);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loadingRef.current || !hasMore || assignments.length === 0) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAssignments(nextPage);
  }, [hasMore, page, assignments.length]);

  const transformedAssignments = assignments.map(transformToAssignment);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <AssignmentCardSkeleton />
        <AssignmentCardSkeleton />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (initialLoad) {
      return (
        <View>
          <AssignmentCardSkeleton />
          <AssignmentCardSkeleton />
          <AssignmentCardSkeleton />
          <AssignmentCardSkeleton />
          <AssignmentCardSkeleton />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <MaterialIcons name="error-outline" size={48} color="#9CA3AF" />
          <Text style={styles.stateText}>{error}</Text>
          <Text style={styles.stateSubtext}>{t("common.Pull down to try again")}</Text>
        </View>
      );
    }

    if (assignments.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <MaterialIcons name="assignment" size={48} color="#9CA3AF" />
          <Text style={styles.stateText}>{t("common.No assignments yet")}</Text>
          <Text style={styles.stateSubtext}>
           {t("common.Check back later for new assignments")}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <PageLayout title="Assignments">
      <View style={styles.container}>
        <AssignmentList
          assignments={transformedAssignments}
          onItemPress={(it) =>
            router.push(`/assignments/${it.id}` as RelativePathString)
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#6366f1"]}
              tintColor="#6366f1"
            />
          }
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    paddingTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    gap: 12,
  },
  stateText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  stateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});